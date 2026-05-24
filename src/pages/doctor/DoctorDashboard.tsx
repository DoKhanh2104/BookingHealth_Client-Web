import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock stats
  const stats = [
    {
      label: 'Ca khám hôm nay',
      value: '12',
      desc: '8 chờ khám, 4 đã hoàn thành',
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-600',
    },
    {
      label: 'Tổng bệnh nhân',
      value: '148',
      desc: 'Thành viên đã tư vấn & điều trị',
      color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600',
    },
    {
      label: 'Đánh giá trung bình',
      value: '4.9 ★',
      desc: 'Dựa trên 92 lượt đánh giá thực tế',
      color: 'border-amber-500/20 bg-amber-500/5 text-amber-600',
    },
    {
      label: 'Doanh thu tháng này',
      value: '24.5Mđ',
      desc: 'Từ các ca đặt lịch trực tuyến',
      color: 'border-purple-500/20 bg-purple-500/5 text-purple-600',
    },
  ];

  // Mock today's pending appointments
  const todayAppointments = [
    {
      id: 1,
      patient: 'Nguyễn Văn Minh',
      time: '08:30 - 09:00',
      symptoms: 'Sốt cao, đau họng kéo dài 2 ngày',
      status: 'CONFIRMED',
    },
    {
      id: 2,
      patient: 'Trần Thị Hà',
      time: '09:30 - 10:00',
      symptoms: 'Đau đầu, chóng mặt khi thay đổi tư thế',
      status: 'CONFIRMED',
    },
    {
      id: 3,
      patient: 'Lê Hoàng Nam',
      time: '10:30 - 11:00',
      symptoms: 'Tái khám định kỳ sau điều trị tiêu hóa',
      status: 'PENDING',
    },
    {
      id: 4,
      patient: 'Phạm Minh Tú',
      time: '14:00 - 14:30',
      symptoms: 'Ho khan có đờm, đau tức ngực nhẹ',
      status: 'PENDING',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-foreground">Chào ngày mới, Bác sĩ! 👋</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Chúc bác sĩ một ngày làm việc hiệu quả và nhiều niềm vui.
          </p>
        </div>
        <button
          onClick={() => navigate('/doctor/appointments')}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 self-start md:self-auto cursor-pointer"
        >
          Xem lịch khám hôm nay
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className={`border rounded-2xl p-5 bg-background flex flex-col justify-between ${s.color}`}
          >
            <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
            <div className="my-3">
              <span className="text-3xl font-black tracking-tight text-foreground">{s.value}</span>
            </div>
            <span className="text-[10px] text-muted-foreground leading-normal">{s.desc}</span>
          </div>
        ))}
      </div>

      {/* Today schedule preview */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
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
          {todayAppointments.map((app) => (
            <div
              key={app.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-foreground text-sm">{app.patient}</span>
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-semibold">
                    {app.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Triệu chứng: {app.symptoms}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/doctor/appointments')}
                  className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Vào ca khám
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
