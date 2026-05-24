import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import type { Doctor, AppointmentSlot } from '../../types';

// Star Icon
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? '#fbbf24' : 'none'}
    stroke={filled ? '#fbbf24' : 'currentColor'}
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

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

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Date and slots management
  const [availableDates] = useState<string[]>(() => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      dates.push(iso);
    }
    return dates;
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch Doctor details
  useEffect(() => {
    if (!id) return;

    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    doctorService
      .getById(Number(id))
      .then((res) => {
        if (!active) return;
        if (res?.result) {
          const realDoc = { ...res.result };

          // Fallback clinic info if missing from backend
          if (!realDoc.clinic) {
            realDoc.clinic = {
              id: 1,
              clinicName: 'Phòng khám Đa khoa Quốc tế BooKingHealth',
              address: 'Tòa nhà GP, 257 Giải Phóng, phường Bạch Mai, quận Hai Bà Trưng, Hà Nội',
            };
          }

          // Populate fallback bio if missing
          if (!realDoc.biography) {
            realDoc.biography = `Bác sĩ chuyên khoa hàng đầu với nhiều năm kinh nghiệm lâm sàng tại các bệnh viện lớn. Chuyên môn sâu rộng trong chẩn đoán, tư vấn phác đồ điều trị và chăm sóc sức khoẻ toàn diện.`;
          }

          setDoctor(realDoc);
        } else {
          setDoctor(null);
        }
      })
      .catch(() => {
        if (!active) return;
        setDoctor(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Fetch Slots when date changes
  useEffect(() => {
    if (!id || !selectedDate) return;

    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoadingSlots(true);
    });

    doctorService
      .getWorkSchedules(Number(id), selectedDate)
      .then((res) => {
        if (!active) return;
        // If API returns schedule, map slots
        if (res?.result && res.result.length > 0) {
          const schedule = res.result[0];
          setSlots(schedule.slots || []);
        } else {
          setSlots([]);
        }
      })
      .catch(() => {
        if (!active) return;
        setSlots([]);
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [id, selectedDate]);

  // Format date helper: "Thứ 2 - 25/5"
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const label = dayNames[d.getDay()];
    const datePart = `${d.getDate()}/${d.getMonth() + 1}`;
    return `${label} - ${datePart}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-background">
        <h2 className="text-xl font-bold text-foreground mb-2">Không tìm thấy bác sĩ</h2>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline text-xs font-semibold"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  /** Có thể bấm đặt lịch: API available + chưa qua giờ hôm nay */
  const canBookSlot = (slot: AppointmentSlot) => {
    if (!slot.available) return false;

    const todayStr = new Date().toISOString().split('T')[0];
    if (selectedDate === todayStr) {
      const [slotHour, slotMin] = String(slot.startTime).split(':').map(Number);
      const now = new Date();
      if (
        now.getHours() > slotHour ||
        (now.getHours() === slotHour && now.getMinutes() >= slotMin)
      ) {
        return false;
      }
    }
    return true;
  };

  const slotDisabledReason = (slot: AppointmentSlot) => {
    if (slot.booked) return 'Đã đặt';
    if (!slot.doctorOpen) return 'Bác sĩ đóng';
    return 'Không khả dụng';
  };

  const titlePrefix = 'Bác sĩ';

  const availableSlotsCount = slots.filter(canBookSlot).length;

  return (
    <div className="bg-muted/10 min-h-screen py-10 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground/80 hover:text-primary font-bold text-xs bg-background border border-border px-4 py-2.5 rounded-xl transition-all shadow-sm hover:border-primary/20 active:scale-[0.98] w-fit cursor-pointer animate-fadeIn"
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

        {/* 2-Column Doctor Info & Booking Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: Profile Bio & Schedules */}
          <div className="md:col-span-2 space-y-6">
            {/* Doctor Bio Card */}
            <div className="bg-background border border-border rounded-2xl p-6 flex gap-6 shadow-sm">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                {doctor.avatar ? (
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-primary" />
                )}
              </div>
              <div className="space-y-3 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded text-[9px]">
                    ★ Yêu thích
                  </span>
                  <h2 className="text-xl font-black text-foreground tracking-tight leading-none">
                    {titlePrefix} {doctor.name}
                  </h2>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{doctor.biography}</p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span>📍</span>
                  <span>
                    {doctor.clinic?.address.split(',').slice(-2).join(',').trim() || 'Việt Nam'}
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule / Time slots Card */}
            <div className="bg-background border border-border rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 flex-wrap relative">
                {/* Custom Date Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-background hover:bg-muted/10 border border-border text-foreground rounded-xl px-3.5 py-2 font-bold text-xs cursor-pointer shadow-sm focus:outline-none transition-all active:scale-[0.98]"
                  >
                    <span>📅</span>
                    <span>{formatDateLabel(selectedDate)}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <>
                      {/* Invisible overlay to close dropdown on outside click */}
                      <div
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute left-0 mt-2 w-56 bg-background border border-border rounded-2xl shadow-xl py-2 z-20 animate-fadeIn min-w-[200px]">
                        {availableDates.map((date) => {
                          const isSelected = date === selectedDate;
                          return (
                            <button
                              key={date}
                              type="button"
                              onClick={() => {
                                setSelectedDate(date);
                                setDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between hover:bg-muted/30 cursor-pointer
                                ${isSelected ? 'text-primary bg-primary/5' : 'text-foreground/80'}
                              `}
                            >
                              <span>{formatDateLabel(date)}</span>
                              {isSelected && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={3}
                                  stroke="currentColor"
                                  className="w-3 h-3 text-primary"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m4.5 12.75 6 6 9-13.5"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <span className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 ml-2">
                  Lịch Khám
                </span>
              </div>

              {/* Time Slots Grid */}
              {loadingSlots ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : slots.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {slots.map((slot) => {
                      const canBook = canBookSlot(slot);
                      const label = `${String(slot.startTime).slice(0, 5)} - ${String(slot.endTime).slice(0, 5)}`;
                      return (
                        <button
                          key={slot.id}
                          disabled={!canBook}
                          title={!canBook ? slotDisabledReason(slot) : undefined}
                          onClick={() => {
                            navigate(
                              `/booking?doctorId=${doctor.id}&date=${selectedDate}&slotId=${slot.id}&startTime=${slot.startTime}&endTime=${slot.endTime}`,
                            );
                          }}
                          className={`
                            py-3 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-0.5
                            ${
                              canBook
                                ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer'
                                : 'bg-muted/10 border-border text-muted-foreground/60 cursor-not-allowed opacity-75'
                            }
                          `}
                        >
                          <span>{label}</span>
                          {!canBook && (
                            <span className="text-[9px] font-semibold normal-case">
                              {slotDisabledReason(slot)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {availableSlotsCount === 0 && (
                    <p className="text-[10px] text-muted-foreground text-center">
                      Không còn ca trống trong ngày này. Vui lòng chọn ngày khác hoặc khung giờ
                      khác.
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Chọn khung giờ mong muốn và đặt lịch (Phí đặt lịch trực tuyến 0đ)
                  </p>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  Bác sĩ không có lịch khám trống vào ngày này. Vui lòng chọn ngày khác.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Clinic Address & Booking Cost Card */}
          <div className="bg-background border border-border rounded-2xl p-6 space-y-6 shadow-sm h-fit">
            {/* Clinic details */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                ĐỊA CHỈ KHÁM
              </h3>
              <p className="font-bold text-foreground text-xs">{doctor.clinic?.clinicName}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {doctor.clinic?.address}
              </p>
            </div>

            <div className="border-t border-border" />

            {/* Price details */}
            <div className="space-y-1">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                GIÁ KHÁM CHUYÊN KHOA
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground text-sm">
                  {doctor.examinationFee
                    ? `${doctor.examinationFee.toLocaleString('vi-VN')}đ`
                    : 'Đang cập nhật'}
                </span>
                <span className="text-muted-foreground/75 text-[10px]">
                  (Giá đã niêm yết công khai)
                </span>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Insurance info */}
            <div className="space-y-1">
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                BẢO HIỂM ÁP DỤNG
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Hỗ trợ thanh toán bảo hiểm y tế nhà nước và bảo hiểm bảo lãnh tư nhân (Bảo Việt,
                PVI, Dai-ichi,...).
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Biography, Specialties & Training Info */}
        <div className="bg-background border border-border rounded-2xl p-8 space-y-8 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-foreground border-l-4 border-primary pl-3">
              Thông tin chuyên khoa & Lĩnh vực điều trị
            </h3>
            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Bác sĩ tiếp nhận tư vấn khám và trực tiếp làm các phác đồ điều trị cho các bệnh lý
                liên quan đến:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Khám và tư vấn chuyên sâu cho bệnh nhân.</li>
                <li>Hội chẩn các ca bệnh khó trong chuyên khoa.</li>
                <li>Định hướng phác đồ và hỗ trợ điều trị phục hồi sức khoẻ toàn diện.</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Education & Qualifications list */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-foreground border-l-4 border-primary pl-3">
              Quá trình đào tạo & Bằng cấp chuyên môn
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {doctor.qualifications && doctor.qualifications.length > 0 ? (
                doctor.qualifications.map((qual) => (
                  <div
                    key={qual.id}
                    className="bg-muted/15 border border-border/80 rounded-xl p-4 flex flex-col justify-between"
                  >
                    <span className="font-bold text-foreground leading-normal">{qual.degree}</span>
                    <span className="text-[10px] text-muted-foreground mt-2">
                      Năm tốt nghiệp/Cấp bằng: {qual.issueDate.split('-')[0]}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-muted-foreground">
                  Đang cập nhật danh sách bằng cấp chuyên môn.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient reviews and comments */}
        <div className="bg-background border border-border rounded-2xl p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-black text-foreground border-l-4 border-primary pl-3">
            Phản hồi của bệnh nhân sau khi đi khám
          </h3>

          <div className="divide-y divide-border">
            {doctor.reviews && doctor.reviews.length > 0 ? (
              doctor.reviews.map((review) => (
                <div key={review.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{review.patientName}</span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                          ✓ Đã khám ngày {review.date}
                        </span>
                      </div>
                      {/* Stars */}
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < review.rating} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-xs pl-0.5">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Chưa có phản hồi nào từ bệnh nhân cho bác sĩ này.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
