import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { doctorService } from '../../services/doctorService';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import type { Doctor } from '../../types';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  BuildingIcon,
  MoneyIcon,
  LightbulbIcon,
} from '../../components/icons';

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

  // Load current user profile to pre-fill info
  useEffect(() => {
    let active = true;
    userService
      .getProfile()
      .then((res) => {
        if (!active) return;
        if (res.result) {
          setBookingName(res.result.name || '');
          setBookingPhone(res.result.phone || '');
        }
      })
      .catch(() => {
        // User not logged in or error, ignore
      });
    return () => {
      active = false;
    };
  }, []);

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

    if (!doctorId || !selectedDate || !slotId) {
      toast.error('Thông tin đặt lịch không hợp lệ.');
      return;
    }

    setBookingSubmitting(true);

    appointmentService
      .book({
        doctorId: Number(doctorId),
        appointmentSlotId: Number(slotId),
        expectedExaminationDate: selectedDate,
        description: bookingReason,
      })
      .then(() => {
        setBookingSuccess(true);
        toast.success('Đặt lịch khám thành công!');
      })
      .catch((error) => {
        const msg =
          error.response?.data?.message || 'Có lỗi xảy ra khi đặt lịch khám. Vui lòng thử lại.';
        toast.error(msg);
      })
      .finally(() => {
        setBookingSubmitting(false);
      });
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
    <div className="bg-muted/10 min-h-screen py-12 text-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-md w-fit">
          <ArrowLeftIcon className="w-4 h-4" />
          Quay lại trang trước
        </button>

        {bookingSuccess ? (
          <div className="card p-12 text-center space-y-6 max-w-2xl mx-auto animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircleIcon className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <h2 className="font-black text-foreground text-2xl tracking-tight">
                ĐẶT LỊCH HẸN THÀNH CÔNG!
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                Lịch hẹn của bạn vào lúc{' '}
                <strong className="text-foreground">
                  {startTime} - {endTime}
                </strong>{' '}
                ngày <strong className="text-foreground">{formatDateLabel(selectedDate)}</strong> đã
                được ghi nhận thành công.
              </p>
              <div className="border border-border rounded-xl p-6 bg-muted/20 text-left max-w-md mx-auto space-y-2 leading-relaxed text-muted-foreground text-sm mt-4">
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
                  <span className="text-primary font-bold text-base">
                    {doctor.examinationFee?.toLocaleString('vi-VN')}đ
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed pt-2 max-w-sm mx-auto">
                Nhân viên tư vấn của phòng khám sẽ liên hệ lại qua số điện thoại để xác nhận thông
                tin cuộc hẹn trong vòng 15-30 phút.
              </p>
            </div>
            <div className="pt-4 flex gap-4 justify-center">
              <button onClick={() => navigate('/specialties')} className="btn btn-outline btn-md">
                Tiếp tục khám chuyên khoa
              </button>
              <button onClick={() => navigate('/')} className="btn btn-primary btn-md">
                Quay lại Trang chủ
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-8">
            {/* LEFT COLUMN (3 cols): Spacious Booking Form */}
            <div className="md:col-span-3 card p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight uppercase">
                  Thông Tin Đăng Ký Khám
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1.5">
                  Vui lòng điền chính xác thông tin cá nhân dưới đây để được hỗ trợ làm hồ sơ khám
                  nhanh nhất.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Patient Full Name */}
                <div className="space-y-2">
                  <label className="block font-bold text-foreground text-base tracking-wide">
                    Họ tên người bệnh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Nhập đầy đủ họ và tên giống trong CCCD..."
                    className="input-field"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block font-bold text-foreground text-base tracking-wide">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="Nhập số điện thoại di động chính chủ..."
                    className="input-field"
                  />
                </div>

                {/* Symptoms / Reason */}
                <div className="space-y-2">
                  <label className="block font-bold text-foreground text-base tracking-wide">
                    Lý do khám / Triệu chứng bệnh (Tùy chọn)
                  </label>
                  <textarea
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    rows={6}
                    placeholder="Mô tả cụ thể các triệu chứng bệnh của bạn để bác sĩ nắm bắt thông tin nhanh nhất (ví dụ: đau ê buốt răng khi ăn nóng lạnh, đau vùng thắt lưng lan xuống chân...)"
                    className="input-field leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-border mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline btn-md"
                  >
                    Hủy lịch đặt
                  </button>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="btn btn-primary btn-md"
                  >
                    {bookingSubmitting ? 'Đang gửi hồ sơ...' : 'Xác nhận đặt lịch khám'}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN (2 cols): Beautiful Appointment Summary Cards */}
            <div className="md:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="card p-6 space-y-5">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider border-b border-border pb-3">
                  Tóm tắt lịch hẹn
                </h3>

                {/* Doctor Bio Card */}
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-border bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {doctor.avatar ? (
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-foreground text-sm sm:text-base truncate">
                      {titlePrefix} {doctor.name}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">
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
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" /> NGÀY ĐẶT KHÁM
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      {formatDateLabel(selectedDate)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80 flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" /> KHUNG GIỜ
                    </span>
                    <span className="font-bold text-primary text-sm">
                      {startTime} - {endTime}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-border/50 my-1"></div>
                  <div className="space-y-1 col-span-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80 flex items-center gap-1">
                      <BuildingIcon className="w-4 h-4" /> ĐỊA ĐIỂM KHÁM
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      {doctor.clinic?.clinicName}
                    </span>
                    <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                      {doctor.clinic?.address}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-border/50 my-1"></div>
                  <div className="space-y-1 col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/80 flex items-center gap-1">
                        <MoneyIcon className="w-4 h-4" /> GIÁ KHÁM NIÊM YẾT
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (Thanh toán trực tiếp tại phòng khám)
                      </span>
                    </div>
                    <span className="font-black text-primary text-base sm:text-lg">
                      {doctor.examinationFee?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Guide Card */}
              <div className="card p-6 space-y-3">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <LightbulbIcon className="w-5 h-5" /> Hướng dẫn đặt khám
                </h3>
                <ul className="list-disc pl-4 text-xs sm:text-sm text-muted-foreground space-y-2 leading-relaxed">
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
