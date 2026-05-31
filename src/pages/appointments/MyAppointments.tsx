import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import type { Appointment } from '../../types';

const StarIcon = ({ filled, onClick }: { filled: boolean; onClick?: () => void }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.5}
    className={`w-6 h-6 ${filled ? 'text-amber-500' : 'text-muted-foreground/40'} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499c.176-.436.792-.436.968 0l2.091 5.176a.5.5 0 0 0 .474.333l5.589.417c.477.036.667.622.316.949L16.82 14.28a.5.5 0 0 0-.144.444l1.329 5.485c.113.468-.37.822-.77.585L12 18.253l-4.716 2.541c-.4.217-.882-.137-.77-.585l1.329-5.485a.5.5 0 0 0-.144-.444L3.633 10.375c-.35-.327-.16-.913.316-.949l5.59-.417a.5.5 0 0 0 .473-.333L11.48 3.5Z"
    />
  </svg>
);

const MyAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  >('ALL');

  // Cancel state
  const [cancellingAppId, setCancellingAppId] = useState<number | null>(null);

  // Review modal state
  const [reviewApp, setReviewApp] = useState<Appointment | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const fetchAppointments = useCallback(() => {
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
          setAppointments(res.result.content);
        } else {
          setAppointments([]);
        }
      })
      .catch(() => {
        toast.error('Không thể tải danh sách lịch hẹn của bạn!');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab]);

  useEffect(() => {
    Promise.resolve().then(fetchAppointments);
  }, [fetchAppointments]);

  const handleCancelClick = (id: number) => {
    setCancellingAppId(id);
  };

  const handleConfirmCancel = () => {
    if (cancellingAppId === null) return;
    appointmentService
      .cancel(cancellingAppId)
      .then(() => {
        toast.success('Hủy lịch hẹn thành công');
        setCancellingAppId(null);
        fetchAppointments();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Có lỗi xảy ra khi hủy lịch.';
        toast.error(msg);
      });
  };

  const handleReviewOpen = (app: Appointment) => {
    setReviewApp(app);
    setRating(5);
    setComment('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewApp || !reviewApp.doctor?.id) return;

    setSubmittingReview(true);
    doctorService
      .createReview({
        doctorId: reviewApp.doctor.id,
        appointmentId: reviewApp.id,
        rating,
        comment: comment.trim() || undefined,
      })
      .then(() => {
        toast.success('Gửi đánh giá bác sĩ thành công!');
        setReviewApp(null);
        fetchAppointments(); // Refresh lists to show "Đã đánh giá"
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Không thể gửi đánh giá lúc này.';
        toast.error(msg);
      })
      .finally(() => {
        setSubmittingReview(false);
      });
  };

  // Format date helper: "Thứ Hai - 25/5"
  const formatDateLabel = (dateStr: string | null) => {
    if (!dateStr) return 'Đang cập nhật';
    const d = new Date(dateStr);
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const label = dayNames[d.getDay()];
    const datePart = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return `${label}, ${datePart}`;
  };

  return (
    <div className="bg-muted/10 min-h-screen py-10 text-xs sm:text-sm">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
              Lịch hẹn của tôi
            </h1>
            <p className="text-muted-foreground text-xs mt-1">
              Xem chi tiết, trạng thái ca khám, nhận đơn thuốc và đánh giá bác sĩ của bạn.
            </p>
          </div>
          {/* <button
            onClick={() => navigate('/doctors')}
            className="px-4.5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-primary/20 text-xs"
          >
            🔍 Tìm chuyên khoa & bác sĩ
          </button> */}
        </div>

        {/* Tabs Filter */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer
                ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                }
              `}
            >
              {tab === 'ALL' && 'Tất cả'}
              {tab === 'PENDING' && 'Chờ duyệt'}
              {tab === 'CONFIRMED' && 'Đã xác nhận'}
              {tab === 'COMPLETED' && 'Đã khám'}
              {tab === 'CANCELLED' && 'Đã hủy'}
            </button>
          ))}
        </div>

        {/* Listings Cards */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((app) => {
              const doctorName = app.doctor?.name ? `BS. ${app.doctor.name}` : 'Bác sĩ y tế';
              const specialty =
                app.doctor?.specialties && app.doctor.specialties.length > 0
                  ? app.doctor.specialties[0].specialtyName
                  : 'Chuyên khoa tổng quát';

              const startTime = app.appointmentSlot?.startTime || '00:00';
              const endTime = app.appointmentSlot?.endTime || '00:00';
              const timeSlot = `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;

              const isReviewed = app.reviews && app.reviews.length > 0;
              const hasAttachment = !!app.attachment;

              return (
                <div
                  key={app.id}
                  className="bg-background border border-border rounded-3xl p-5 sm:p-6 shadow-sm hover:border-border/80 transition-all space-y-4"
                >
                  {/* Top: Doctor Info & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-start gap-3.5">
                      <div className="space-y-0.5">
                        <h3 className="font-extrabold text-foreground text-sm sm:text-base leading-snug">
                          {doctorName}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-normal">{specialty}</p>
                        <p className="text-[10px] text-muted-foreground/80 leading-normal">
                          📍 {app.doctor?.clinic?.clinicName || 'Phòng khám đa khoa BookingHealth'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 text-right">
                      {/* Status badge */}
                      <span
                        className={`
                        px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider
                        ${app.status === 0 && 'bg-amber-500/10 text-amber-600 border-amber-500/20'}
                        ${app.status === 1 && 'bg-blue-500/10 text-blue-600 border-blue-500/20'}
                        ${app.status === 2 && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}
                        ${app.status === 3 && 'bg-red-500/10 text-red-600 border-red-500/20'}
                      `}
                      >
                        {app.status === 0 && 'Chờ duyệt'}
                        {app.status === 1 && 'Đã xác nhận'}
                        {app.status === 2 && 'Đã khám xong'}
                        {app.status === 3 && 'Đã hủy'}
                      </span>
                      <div className="text-xs text-muted-foreground font-semibold mt-0.5">
                        💵 Phí khám:{' '}
                        <strong className="text-primary">
                          {(app.totalAmount || 0).toLocaleString('vi-VN')}đ
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Mid: Examination Time Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/20 border border-border/60 rounded-2xl p-4 leading-relaxed">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground block">
                        📅 LỊCH KHÁM
                      </span>
                      <span className="font-bold text-foreground text-xs">
                        {formatDateLabel(app.expectedExaminationDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground block">
                        ⏳ GIỜ KHÁM
                      </span>
                      <span className="font-bold text-primary text-xs">{timeSlot}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground block">
                        💬 LÝ DO KHÁM
                      </span>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.description || 'Không mô tả lý do khám'}
                      </p>
                    </div>
                  </div>

                  {/* Completed result details (prescriptions/diagnosis) */}
                  {app.status === 2 && (
                    <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4 space-y-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 block">
                          🩺 Chẩn đoán của bác sĩ
                        </span>
                        <p className="text-xs text-foreground mt-0.5 leading-relaxed font-semibold">
                          {app.diagnosis || 'Đang cập nhật chẩn đoán...'}
                        </p>
                      </div>
                      {app.medicine && (
                        <div>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 block">
                            💊 Đơn thuốc kê kèm
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-line leading-relaxed italic bg-background/50 border border-border/40 p-3 rounded-xl">
                            {app.medicine}
                          </p>
                        </div>
                      )}
                      {hasAttachment && (
                        <div className="pt-1 flex gap-2">
                          <a
                            href={app.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/20 bg-white hover:bg-emerald-500/10 text-emerald-600 font-bold text-xs rounded-xl shadow-sm transition-all"
                          >
                            📁 Xem kết quả xét nghiệm / tệp đính kèm
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="flex justify-end gap-2.5 pt-2">
                    {(app.status === 0 || app.status === 1) && (
                      <button
                        onClick={() => handleCancelClick(app.id)}
                        className="px-4 py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-600 font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-all"
                      >
                        ❌ Hủy lịch đặt
                      </button>
                    )}
                    {app.status === 2 && (
                      <>
                        <button
                          onClick={() => navigate(`/appointments/${app.id}/chat`)}
                          className="px-4.5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-primary/20 transition-all mr-1.5"
                        >
                          💬 Chat tư vấn
                        </button>
                        {isReviewed ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground/80 bg-muted/30 px-3 py-2 rounded-xl">
                            <span>★</span>
                            <span className="font-semibold">
                              Bạn đã gửi đánh giá {app.reviews![0].rating}/5
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReviewOpen(app)}
                            className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-amber-500/20 transition-all"
                          >
                            ⭐️ Đánh giá bác sĩ
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-background border border-border border-dashed rounded-3xl p-16 text-center shadow-sm space-y-4">
            <div className="text-4xl">🗓️</div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-foreground">Không tìm thấy lịch đặt nào</h3>
              <p className="text-muted-foreground text-xs max-w-sm mx-auto leading-normal">
                Bạn chưa có lịch hẹn khám nào với trạng thái này hoặc danh sách rỗng.
              </p>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-black rounded-xl text-xs cursor-pointer shadow-md shadow-primary/20"
            >
              Đặt lịch khám ngay
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancellingAppId !== null && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-sm overflow-hidden shadow-2xl space-y-4">
            <h3 className="font-black text-foreground text-base uppercase tracking-wide text-center">
              Xác nhận hủy lịch
            </h3>
            <p className="text-xs text-muted-foreground leading-normal text-center">
              Bạn có chắc chắn muốn hủy lịch hẹn khám bệnh này không? Hành động này không thể hoàn
              tác.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setCancellingAppId(null)}
                className="flex-1 py-2.5 border border-border hover:bg-accent text-muted-foreground font-bold rounded-xl cursor-pointer text-xs transition-colors"
              >
                Không, giữ lịch
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl cursor-pointer text-xs transition-all shadow-md shadow-red-500/25"
              >
                Có, hủy ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review & Feedback Modal */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-black text-foreground text-sm uppercase tracking-wide">
                Đánh giá chất lượng dịch vụ
              </h3>
              <button
                onClick={() => setReviewApp(null)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold border border-border px-2 py-1 rounded-lg hover:bg-accent cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4 text-xs">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Lòng bác sĩ thế nào? Hãy chia sẻ đánh giá của bạn về bác sĩ{' '}
                  <strong className="text-foreground">
                    {reviewApp.doctor?.name ? `BS. ${reviewApp.doctor.name}` : 'chăm sóc y tế'}
                  </strong>
                  :
                </p>
                {/* Stars container */}
                <div className="flex justify-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={star <= rating} onClick={() => setRating(star)} />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-foreground">
                  Ý kiến đánh giá (Tùy chọn)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Bác sĩ khám kỹ càng, tư vấn nhiệt tình, cơ sở vật chất khang trang..."
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setReviewApp(null)}
                  className="px-4 py-2 border border-border hover:bg-accent text-muted-foreground font-bold rounded-xl cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl cursor-pointer shadow-md shadow-amber-500/25 disabled:bg-amber-500/50"
                >
                  {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
