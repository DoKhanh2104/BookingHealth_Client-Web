import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { appointmentService } from '../../services/appointmentService';
import type { DoctorDashboardResponse } from '../../types';
import { StarIcon } from '../../components/icons';

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DoctorDashboardResponse | null>(null);

  useEffect(() => {
    let active = true;
    appointmentService
      .getDashboardStats()
      .then((res) => {
        if (!active) return;
        if (res.result) {
          setDashboardData(res.result);
        }
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu thống kê dashboard!');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Format revenue display
  const monthlyRevenueVal = dashboardData?.monthlyRevenue || 0;
  const formattedRevenue =
    monthlyRevenueVal >= 1000000
      ? `${(monthlyRevenueVal / 1000000).toFixed(1)}Mđ`
      : `${monthlyRevenueVal.toLocaleString('vi-VN')}đ`;

  const stats = [
    {
      label: 'Ca khám hôm nay',
      value: String(dashboardData?.todayAppointmentsCount || 0),
      desc: `${dashboardData?.todayPendingCount || 0} chờ khám, ${dashboardData?.todayCompletedCount || 0} đã hoàn thành`,
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-600',
      showStar: false,
    },
    {
      label: 'Tổng bệnh nhân',
      value: String(dashboardData?.totalPatientsCount || 0),
      desc: 'Thành viên đã tư vấn & điều trị',
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-600',
      showStar: false,
    },
    {
      label: 'Đánh giá trung bình',
      value: `${dashboardData?.averageRating || 5.0}`,
      desc: `Dựa trên ${dashboardData?.reviewCount || 0} lượt đánh giá thực tế`,
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-600',
      showStar: true,
    },
    {
      label: 'Doanh thu tháng này',
      value: formattedRevenue,
      desc: 'Từ các ca đặt lịch trực tuyến',
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-600',
      showStar: false,
    },
  ];

  const todayAppointments = (dashboardData?.todayFeaturedAppointments || []).map((apiApp) => {
    const startTime = apiApp.appointmentSlot?.startTime || '00:00';
    const endTime = apiApp.appointmentSlot?.endTime || '00:00';
    return {
      id: apiApp.id,
      patient: apiApp.user?.name || 'Bệnh nhân ẩn danh',
      time: `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`,
      symptoms: apiApp.description || 'Không có triệu chứng',
    };
  });

  return (
    <div className="space-y-8 text-xs">
      {/* Welcome banner */}
      <div className="card bg-primary/5 border-primary/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-foreground">Chào ngày mới, Bác sĩ!</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Chúc bác sĩ một ngày làm việc hiệu quả và nhiều niềm vui.
          </p>
        </div>
        <button
          onClick={() => navigate('/doctor/appointments')}
          className="btn btn-primary btn-md self-start md:self-auto"
        >
          Xem lịch khám hôm nay
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`card p-5 flex flex-col justify-between ${s.color}`}>
            <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
            <div className="my-3 flex items-center gap-1.5">
              <span className="text-3xl font-black tracking-tight text-foreground">{s.value}</span>
              {s.showStar && <StarIcon filled className="w-6 h-6 text-amber-400" />}
            </div>
            <span className="text-[10px] text-muted-foreground leading-normal">{s.desc}</span>
          </div>
        ))}
      </div>

      {/* Today schedule preview */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-extrabold text-foreground text-sm">Các ca hẹn nổi bật hôm nay</h3>
          <button
            onClick={() => navigate('/doctor/appointments')}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Tất cả lịch hẹn
          </button>
        </div>
        <div className="divide-y divide-border">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((app) => (
              <div
                key={app.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-foreground text-sm">{app.patient}</span>
                    <span className="badge bg-primary/10 text-primary border border-primary/20">
                      {app.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Triệu chứng: {app.symptoms}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/doctor/appointments')}
                    className="btn btn-outline btn-sm border-primary/20 text-primary bg-primary/10 hover:bg-primary/20"
                  >
                    Vào ca khám
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              Hôm nay bác sĩ không có ca khám nào nổi bật.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
