import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { appointmentService } from '../../services/appointmentService';
import type { Appointment as ApiAppointment } from '../../types';

interface Appointment {
  id: number;
  patientName: string;
  phone: string;
  timeSlot: string;
  date: string;
  symptoms: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  diagnosis?: string;
  prescription?: string;
  attachment?: string;
  fee: number;
}

const DoctorAppointments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  >('ALL');
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);

  // Clinical Form States
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [attachment, setAttachment] = useState('');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    let statusNum: number | undefined = undefined;
    if (activeTab === 'PENDING') statusNum = 0;
    else if (activeTab === 'CONFIRMED') statusNum = 1;
    else if (activeTab === 'COMPLETED') statusNum = 2;
    else if (activeTab === 'CANCELLED') statusNum = 3;

    appointmentService
      .getMyAppointments(0, 100, statusNum)
      .then((res) => {
        if (res.result?.content) {
          const mapped = res.result.content.map((apiApp: ApiAppointment) => {
            const startTime = apiApp.appointmentSlot?.startTime || '00:00';
            const endTime = apiApp.appointmentSlot?.endTime || '00:00';
            const timeSlot = `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;

            let statusStr: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' = 'PENDING';
            if (apiApp.status === 1) statusStr = 'CONFIRMED';
            else if (apiApp.status === 2) statusStr = 'COMPLETED';
            else if (apiApp.status === 3) statusStr = 'CANCELLED';

            return {
              id: apiApp.id,
              patientName: apiApp.user?.name || 'Bệnh nhân ẩn danh',
              phone: apiApp.user?.phone || 'Chưa cập nhật',
              timeSlot,
              date: apiApp.expectedExaminationDate || '',
              symptoms: apiApp.description || 'Không có triệu chứng',
              status: statusStr,
              diagnosis: apiApp.diagnosis,
              prescription: apiApp.medicine,
              attachment: apiApp.attachment,
              fee: apiApp.totalAmount || 0,
            };
          });
          setAppointments(mapped);
        } else {
          setAppointments([]);
        }
      })
      .catch(() => {
        toast.error('Không thể tải danh sách ca khám từ hệ thống!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchAppointments());
  }, [activeTab]);

  const filteredAppointments = appointments.filter((app) => {
    if (activeTab === 'ALL') return true;
    return app.status === activeTab;
  });

  const handleApprove = (id: number) => {
    appointmentService
      .confirm(id)
      .then(() => {
        toast.success('Đã xác nhận ca khám thành công');
        fetchAppointments();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Không thể duyệt ca khám.';
        toast.error(msg);
      });
  };

  const handleCancel = (id: number) => {
    appointmentService
      .cancel(id)
      .then(() => {
        toast.success('Đã hủy lịch hẹn');
        fetchAppointments();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Không thể hủy lịch hẹn.';
        toast.error(msg);
      });
  };

  const handleOpenExam = (app: Appointment) => {
    setSelectedApp(app);
    setDiagnosis(app.diagnosis || '');
    setPrescription(app.prescription || '');
    setAttachment(app.attachment || '');
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      toast.error('Vui lòng nhập chẩn đoán bệnh');
      return;
    }
    if (!selectedApp) return;

    appointmentService
      .complete(selectedApp.id, {
        diagnosis,
        medicine: prescription,
        attachment,
      })
      .then(() => {
        toast.success('Lưu bệnh án & hoàn tất ca khám thành công!');
        setSelectedApp(null);
        fetchAppointments();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Không thể lưu bệnh án.';
        toast.error(msg);
      });
  };

  return (
    <div className="space-y-6">
      {/* Filters Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {(['CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer
              ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-accent'
              }
            `}
          >
            {tab === 'CONFIRMED' && 'Đã xác nhận'}
            {tab === 'PENDING' && 'Chờ duyệt'}
            {tab === 'COMPLETED' && 'Đã hoàn thành'}
            {tab === 'CANCELLED' && 'Đã hủy'}
            {tab === 'ALL' && 'Tất cả'}
          </button>
        ))}
      </div>

      {/* Appointment table/list card */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Bệnh nhân</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Triệu chứng</th>
                <th className="px-6 py-4">Phí khám</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                      Đang tải danh sách ca khám...
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{app.patientName}</div>
                      <div className="text-[10px] text-muted-foreground/80 mt-0.5">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{app.timeSlot}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{app.date}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-muted-foreground">
                      {app.symptoms}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {app.fee.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                        px-2.5 py-1 rounded-full text-[9px] font-black uppercase border
                        ${app.status === 'CONFIRMED' && 'bg-blue-500/10 text-blue-600 border-blue-500/20'}
                        ${app.status === 'PENDING' && 'bg-amber-500/10 text-amber-600 border-amber-500/20'}
                        ${app.status === 'COMPLETED' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}
                        ${app.status === 'CANCELLED' && 'bg-red-500/10 text-red-600 border-red-500/20'}
                      `}
                      >
                        {app.status === 'CONFIRMED' && 'Đã duyệt'}
                        {app.status === 'PENDING' && 'Chờ duyệt'}
                        {app.status === 'COMPLETED' && 'Đã khám'}
                        {app.status === 'CANCELLED' && 'Đã hủy'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {app.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="px-2.5 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleCancel(app.id)}
                              className="px-2.5 py-1.5 bg-red-500 text-white hover:bg-red-600 text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {app.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => handleOpenExam(app)}
                              className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary-hover text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Khám bệnh
                            </button>
                            <button
                              onClick={() => handleCancel(app.id)}
                              className="px-2.5 py-1.5 border border-border text-muted-foreground hover:bg-accent text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Hủy lịch
                            </button>
                          </>
                        )}
                        {app.status === 'COMPLETED' && (
                          <button
                            onClick={() => handleOpenExam(app)}
                            className="px-3 py-1.5 border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            Xem bệnh án
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Không tìm thấy lịch hẹn nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Examination & Medical Record Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-foreground text-sm">
                  {selectedApp.status === 'COMPLETED'
                    ? 'Hồ sơ bệnh án chi tiết'
                    : 'Phiếu kết quả khám bệnh'}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Bệnh nhân: {selectedApp.patientName} ({selectedApp.phone})
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold border border-border p-1.5 rounded-lg hover:bg-accent cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <form
              onSubmit={handleSubmitExam}
              className="p-6 space-y-4 overflow-y-auto flex-1 text-xs"
            >
              <div className="bg-muted/30 border border-border rounded-xl p-3.5 space-y-1 text-[11px] leading-relaxed text-muted-foreground">
                <p>
                  <span className="font-bold text-foreground">Triệu chứng ban đầu:</span>{' '}
                  {selectedApp.symptoms}
                </p>
                <p>
                  <span className="font-bold text-foreground">Giờ hẹn khám:</span>{' '}
                  {selectedApp.timeSlot} | {selectedApp.date}
                </p>
              </div>

              {/* Chẩn đoán bệnh */}
              <div className="space-y-1.5">
                <label className="block font-bold text-foreground">
                  Chẩn đoán y khoa (Diagnosis) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  disabled={selectedApp.status === 'COMPLETED'}
                  rows={3}
                  placeholder="Nhập chẩn đoán lâm sàng chi tiết..."
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary disabled:bg-muted/50 disabled:text-muted-foreground"
                />
              </div>

              {/* Kê đơn thuốc */}
              <div className="space-y-1.5">
                <label className="block font-bold text-foreground">Đơn thuốc (Prescription)</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  disabled={selectedApp.status === 'COMPLETED'}
                  rows={3}
                  placeholder="Nhập tên thuốc, liều lượng, cách dùng chi tiết..."
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary disabled:bg-muted/50 disabled:text-muted-foreground"
                />
              </div>

              {/* Đường dẫn kết quả/Tệp đính kèm */}
              <div className="space-y-1.5">
                <label className="block font-bold text-foreground">
                  Tệp đính kèm / Kết quả xét nghiệm (URL)
                </label>
                <input
                  type="text"
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  disabled={selectedApp.status === 'COMPLETED'}
                  placeholder="Đường dẫn ảnh chụp X-quang, phiếu siêu âm, xét nghiệm..."
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary disabled:bg-muted/50 disabled:text-muted-foreground"
                />
              </div>

              {selectedApp.status !== 'COMPLETED' && (
                <div className="pt-2 flex justify-end gap-2 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 border border-border hover:bg-accent text-muted-foreground font-bold rounded-xl cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-xl cursor-pointer shadow-md shadow-primary/25"
                  >
                    Hoàn tất khám & Lưu
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
