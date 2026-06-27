import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { appointmentService } from '../../services/appointmentService';
import { uploadService } from '../../services/uploadService';
import type { Appointment as ApiAppointment } from '../../types';
import { XIcon } from '../../components/icons';

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

/**
 * Lịch còn "Chờ duyệt" nhưng đã qua giờ khám (hết slot) → coi là quá hạn.
 * Phòng hờ ở FE; backend cũng tự huỷ các lịch PENDING quá hạn.
 */
const isOverduePending = (app: Appointment): boolean => {
  if (app.status !== 'PENDING' || !app.date) return false;
  const endPart = app.timeSlot.split('-')[1]?.trim() || '23:59';
  const dt = new Date(`${app.date}T${endPart}:00`);
  return !Number.isNaN(dt.getTime()) && dt.getTime() < Date.now();
};

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadingFile, setUploadingFile] = useState(false);

  const fetchAppointments = useCallback(
    (pageToFetch: number) => {
      setLoading(true);
      let statusNum: number | undefined = undefined;
      if (activeTab === 'PENDING') statusNum = 0;
      else if (activeTab === 'CONFIRMED') statusNum = 1;
      else if (activeTab === 'COMPLETED') statusNum = 2;
      else if (activeTab === 'CANCELLED') statusNum = 3;

      appointmentService
        .getMyAppointments(pageToFetch, 10, statusNum)
        .then((res) => {
          if (res.result?.content) {
            setTotalPages(res.result.totalPages || 1);
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
            setTotalPages(1);
          }
        })
        .catch(() => {
          toast.error('Không thể tải danh sách ca khám từ hệ thống!');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [activeTab],
  );

  useEffect(() => {
    Promise.resolve().then(() => fetchAppointments(currentPage));
  }, [fetchAppointments, currentPage]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(0); // Reset page when changing tab
  };

  const filteredAppointments = appointments.filter((app) => {
    if (activeTab === 'ALL') return true;
    return app.status === activeTab;
  });

  const handleApprove = (id: number) => {
    appointmentService
      .confirm(id)
      .then(() => {
        toast.success('Đã xác nhận ca khám thành công');
        fetchAppointments(currentPage);
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
        fetchAppointments(currentPage);
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
        fetchAppointments(currentPage);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Không thể lưu bệnh án.';
        toast.error(msg);
      });
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res.code === 1000 && res.result) {
        setAttachment(res.result);
        toast.success('Tải lên tệp đính kèm thành công');
      } else {
        toast.error(res.message || 'Lỗi tải lên tệp đính kèm');
      }
    } catch (error) {
      console.log(error);
      toast.error('Đã xảy ra lỗi khi tải lên tệp');
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {(['CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
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
      <div className="card overflow-hidden shadow-sm">
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
                filteredAppointments.map((app) => {
                  const overdue = isOverduePending(app);
                  return (
                    <tr key={app.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{app.patientName}</div>
                        <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                          {app.phone}
                        </div>
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
                          className={`badge uppercase border
                        ${overdue && 'bg-slate-500/10 text-slate-600 border-slate-500/20'}
                        ${!overdue && app.status === 'CONFIRMED' && 'bg-blue-500/10 text-blue-600 border-blue-500/20'}
                        ${!overdue && app.status === 'PENDING' && 'bg-amber-500/10 text-amber-600 border-amber-500/20'}
                        ${app.status === 'COMPLETED' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}
                        ${app.status === 'CANCELLED' && 'bg-red-500/10 text-red-600 border-red-500/20'}
                      `}
                        >
                          {overdue && 'Quá hạn'}
                          {!overdue && app.status === 'CONFIRMED' && 'Đã duyệt'}
                          {!overdue && app.status === 'PENDING' && 'Chờ duyệt'}
                          {app.status === 'COMPLETED' && 'Đã khám'}
                          {app.status === 'CANCELLED' && 'Đã hủy'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {app.status === 'PENDING' && (
                            <>
                              {!overdue && (
                                <button
                                  onClick={() => handleApprove(app.id)}
                                  className="btn btn-sm bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                                >
                                  Duyệt
                                </button>
                              )}
                              <button
                                onClick={() => handleCancel(app.id)}
                                className="btn btn-danger btn-sm"
                              >
                                Hủy
                              </button>
                            </>
                          )}
                          {app.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleOpenExam(app)}
                              className="btn btn-primary btn-sm"
                            >
                              Khám bệnh
                            </button>
                          )}
                          {app.status === 'COMPLETED' && (
                            <button
                              onClick={() => handleOpenExam(app)}
                              className="btn btn-outline btn-sm border-primary/20 text-primary bg-primary/5 hover:bg-primary/10"
                            >
                              Xem bệnh án
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Trang <span className="font-bold text-foreground">{currentPage + 1}</span> /{' '}
              {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0 || loading}
                className="btn btn-outline btn-sm"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1 || loading}
                className="btn btn-outline btn-sm"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Examination & Medical Record Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-3xl overflow-hidden shadow-lg flex flex-col max-h-[90vh]">
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
                className="btn btn-outline btn-sm px-2"
                aria-label="Đóng"
              >
                <XIcon className="w-4 h-4" />
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
                  className="input-field disabled:bg-muted/50 disabled:text-muted-foreground"
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
                  className="input-field disabled:bg-muted/50 disabled:text-muted-foreground"
                />
              </div>

              {/* Đường dẫn kết quả/Tệp đính kèm */}
              <div className="space-y-1.5">
                <label className="block font-bold text-foreground">
                  Tệp đính kèm / Kết quả xét nghiệm (PDF, Ảnh)
                </label>
                {selectedApp.status !== 'COMPLETED' ? (
                  <div className="flex items-center gap-3">
                    <label className="btn btn-outline btn-md min-w-30">
                      {uploadingFile ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          Đang tải...
                        </div>
                      ) : (
                        'Chọn tệp (PDF/Ảnh)'
                      )}
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={handleUploadAttachment}
                        disabled={uploadingFile}
                      />
                    </label>
                    {attachment && (
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline truncate max-w-xs"
                      >
                        Đã tải lên tệp đính kèm
                      </a>
                    )}
                  </div>
                ) : attachment ? (
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-md bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                  >
                    Xem tệp đính kèm đã lưu
                  </a>
                ) : (
                  <p className="text-muted-foreground italic">Không có tệp đính kèm</p>
                )}
              </div>

              {selectedApp.status !== 'COMPLETED' && (
                <div className="pt-2 flex justify-end gap-2 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="btn btn-outline btn-md"
                  >
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn btn-primary btn-md">
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
