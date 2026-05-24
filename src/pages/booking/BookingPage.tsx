import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { doctorService } from '../../services/doctorService';
import type { Doctor } from '../../types';

// User Profile Fallback Icon
const UserIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Retrieve parameters from URL
  const doctorId = searchParams.get('doctorId');
  const selectedDate = searchParams.get('date');
  const slotId = searchParams.get('slotId');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');

  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Form states
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    // Fallback doctor object
    const fallbackDoctor: Doctor = {
      id: Number(doctorId) || 1,
      name: 'Vũ Văn Hòa',
      biography:
        'PGS. TS. BSCKII. TTUT Vũ Văn Hòa là bác sĩ có hơn 35 năm kinh nghiệm về cột sống, chấn thương chỉnh hình.',
      practiceStartDate: '1991-01-01',
      clinic: {
        id: 1,
        clinicName: 'SpineTech Clinic',
        address: 'Tòa nhà GP, 257 Giải Phóng, phường Bạch Mai, quận Hai Bà Trưng, Hà Nội',
      },
      specialties: [{ id: 1, specialtyName: 'Cơ xương khớp' }],
      examinationFee: 500000,
    };

    if (!doctorId) {
      Promise.resolve().then(() => {
        if (active) setLoading(false);
      });
      return;
    }

    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    doctorService
      .getById(Number(doctorId))
      .then((res) => {
        if (!active) return;
        if (res?.result) {
          const realDoc = { ...res.result };
          if (!realDoc.clinic) {
            realDoc.clinic = {
              id: 1,
              clinicName: 'Phòng khám Đa khoa Quốc tế BooKingHealth',
              address: 'Tòa nhà GP, 257 Giải Phóng, phường Bạch Mai, quận Hai Bà Trưng, Hà Nội',
            };
          }
          setDoctor(realDoc);
        } else {
          setDoctor(fallbackDoctor);
        }
      })
      .catch(() => {
        if (!active) return;
        setDoctor(fallbackDoctor);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [doctorId]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) {
      toast.error('Vui lòng điền đầy đủ họ tên và số điện thoại');
      return;
    }

    setBookingSubmitting(true);

    // Simulate API request to book
    setTimeout(() => {
      setBookingSubmitting(false);
      setBookingSuccess(true);
      toast.success('Đặt lịch khám thành công!');
    }, 1500);
  };

  // Format date helper: "Thứ Hai - 25/5"
  const formatDateLabel = (dateStr: string | null) => {
    if (!dateStr) return 'Đang cập nhật';
    const d = new Date(dateStr);
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const label = dayNames[d.getDay()];
    const datePart = `${d.getDate()}/${d.getMonth() + 1}`;

    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) {
      return `Hôm nay - ${datePart}`;
    }
    return `${label} - ${datePart}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doctorId || !selectedDate || !slotId || !doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-background">
        <h2 className="text-xl font-bold text-foreground mb-2">Thông tin lịch hẹn không hợp lệ</h2>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline text-xs font-semibold cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const titlePrefix = 'Bác sĩ';

  return (
    <div className="bg-muted/10 min-h-screen py-12 text-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground/80 hover:text-primary font-bold text-xs bg-background border border-border px-4 py-2.5 rounded-xl transition-all shadow-sm hover:border-primary/20 active:scale-[0.98] w-fit cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Quay lại trang trước
        </button>

        {bookingSuccess ? (
          <div className="bg-background border border-border rounded-3xl p-12 text-center space-y-6 shadow-md max-w-xl mx-auto animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm">
              ✓
            </div>
            <div className="space-y-3">
              <h2 className="font-black text-foreground text-xl tracking-tight">
                ĐẶT LỊCH HẸN THÀNH CÔNG!
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Lịch hẹn của bạn vào lúc{' '}
                <strong className="text-foreground">
                  {startTime} - {endTime}
                </strong>{' '}
                ngày <strong className="text-foreground">{formatDateLabel(selectedDate)}</strong> đã
                được ghi nhận thành công.
              </p>
              <div className="border border-border rounded-2xl p-4 bg-muted/20 text-left max-w-sm mx-auto space-y-1.5 leading-relaxed text-muted-foreground text-[11px] mt-4">
                <p>
                  <span className="font-bold text-foreground">Họ tên người khám:</span>{' '}
                  {bookingName}
                </p>
                <p>
                  <span className="font-bold text-foreground">Số điện thoại liên hệ:</span>{' '}
                  {bookingPhone}
                </p>
                {bookingReason && (
                  <p>
                    <span className="font-bold text-foreground">Triệu chứng khám:</span>{' '}
                    {bookingReason}
                  </p>
                )}
                <p>
                  <span className="font-bold text-foreground">Địa điểm khám:</span>{' '}
                  {doctor.clinic?.clinicName}
                </p>
                <p>
                  <span className="font-bold text-foreground">Phí tư vấn:</span>{' '}
                  <span className="text-primary font-bold">
                    {doctor.examinationFee?.toLocaleString('vi-VN')}đ
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground text-[10px] leading-relaxed pt-2 max-w-xs mx-auto">
                Nhân viên tư vấn của phòng khám sẽ liên hệ lại qua số điện thoại để xác nhận thông
                tin cuộc hẹn trong vòng 15-30 phút.
              </p>
            </div>
            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => navigate('/specialties')}
                className="px-6 py-3 border border-border hover:bg-accent text-muted-foreground font-bold rounded-2xl cursor-pointer transition-colors text-xs"
              >
                Tiếp tục khám chuyên khoa
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-black rounded-2xl cursor-pointer shadow-lg shadow-primary/20 transition-all text-xs"
              >
                Quay lại Trang chủ
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-8">
            {/* LEFT COLUMN (3 cols): Spacious Booking Form */}
            <div className="md:col-span-3 bg-background border border-border rounded-3xl p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-foreground tracking-tight uppercase">
                  Thông Tin Đăng Ký Khám
                </h2>
                <p className="text-muted-foreground text-[10px] mt-1">
                  Vui lòng điền chính xác thông tin cá nhân dưới đây để được hỗ trợ làm hồ sơ khám
                  nhanh nhất.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                {/* Patient Full Name */}
                <div className="space-y-2">
                  <label className="block font-bold text-foreground text-xs uppercase tracking-wider">
                    Họ tên người bệnh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Nhập đầy đủ họ và tên giống trong CCCD..."
                    className="w-full px-4 py-3 border border-border rounded-2xl bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block font-bold text-foreground text-xs uppercase tracking-wider">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="Nhập số điện thoại di động chính chủ..."
                    className="w-full px-4 py-3 border border-border rounded-2xl bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                {/* Symptoms / Reason */}
                <div className="space-y-2">
                  <label className="block font-bold text-foreground text-xs uppercase tracking-wider">
                    Lý do khám / Triệu chứng bệnh (Tùy chọn)
                  </label>
                  <textarea
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    rows={6}
                    placeholder="Mô tả cụ thể các triệu chứng bệnh của bạn để bác sĩ nắm bắt thông tin nhanh nhất (ví dụ: đau ê buốt răng khi ăn nóng lạnh, đau vùng thắt lưng lan xuống chân...)"
                    className="w-full px-4 py-3 border border-border rounded-2xl bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-border mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-border hover:bg-accent text-muted-foreground font-extrabold rounded-2xl cursor-pointer transition-all"
                  >
                    Hủy lịch đặt
                  </button>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-black rounded-2xl cursor-pointer shadow-lg shadow-primary/25 disabled:bg-primary/50 transition-all active:scale-[0.98]"
                  >
                    {bookingSubmitting ? 'Đang gửi hồ sơ...' : 'Xác nhận đặt lịch khám'}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN (2 cols): Beautiful Appointment Summary Cards */}
            <div className="md:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="bg-background border border-border rounded-3xl p-6 space-y-5 shadow-sm">
                <h3 className="text-xs font-black text-foreground uppercase tracking-wider border-b border-border pb-3">
                  Tóm tắt lịch hẹn
                </h3>

                {/* Doctor Bio Card */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-border bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    {doctor.avatar ? (
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-foreground text-xs truncate">
                      {titlePrefix} {doctor.name}
                    </h4>
                    <p className="text-muted-foreground text-[10px] leading-relaxed">
                      {doctor.specialties && doctor.specialties.length > 0
                        ? doctor.specialties[0].specialtyName
                        : 'Chuyên khoa tổng quát'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/80 my-2" />

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 leading-normal">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground/80 block">
                      📅 NGÀY ĐẶT KHÁM
                    </span>
                    <span className="font-bold text-foreground text-xs">
                      {formatDateLabel(selectedDate)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground/80 block">
                      ⏳ KHUNG GIỜ
                    </span>
                    <span className="font-bold text-primary text-xs">
                      {startTime} - {endTime}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-border/50 my-1"></div>
                  <div className="space-y-1 col-span-2">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground/80 block">
                      🏥 ĐỊA ĐIỂM KHÁM
                    </span>
                    <span className="font-bold text-foreground text-xs">
                      {doctor.clinic?.clinicName}
                    </span>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                      {doctor.clinic?.address}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-border/50 my-1"></div>
                  <div className="space-y-1 col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground/80 block">
                        💵 GIÁ KHÁM NIÊM YẾT
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        (Thanh toán trực tiếp tại phòng khám)
                      </span>
                    </div>
                    <span className="font-black text-primary text-sm">
                      {doctor.examinationFee?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Guide Card */}
              <div className="bg-background border border-border rounded-3xl p-6 space-y-3 shadow-sm">
                <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <span>💡</span> Hướng dẫn đặt khám
                </h3>
                <ul className="list-disc pl-4 text-[10px] text-muted-foreground space-y-2 leading-relaxed">
                  <li>
                    Lịch hẹn sau khi đặt sẽ được xác nhận bởi nhân viên tư vấn trong 15-30 phút qua
                    điện thoại.
                  </li>
                  <li>
                    Bạn không cần thanh toán bất kỳ chi phí đặt lịch trực tuyến nào (Phí dịch vụ
                    0đ).
                  </li>
                  <li>
                    Vui lòng mang theo sổ khám bệnh cũ hoặc các xét nghiệm y khoa trước đó (nếu có)
                    khi đến điểm hẹn.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
