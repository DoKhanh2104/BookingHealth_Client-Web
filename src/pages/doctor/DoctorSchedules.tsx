import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { doctorService } from '../../services/doctorService';
import { userService } from '../../services/userService';
import type { AppointmentSlot } from '../../types';

const DoctorSchedules: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [leaveStartDate, setLeaveStartDate] = useState<string>('');
  const [leaveEndDate, setLeaveEndDate] = useState<string>('');
  const [leaveReason, setLeaveReason] = useState<string>('');

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

  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Fetch Doctor Profile to get doctorId
  useEffect(() => {
    let active = true;
    userService
      .getProfile()
      .then((res) => {
        if (!active) return;
        if (res.result?.doctorId) {
          setDoctorId(res.result.doctorId);
        } else {
          toast.error('Không tìm thấy thông tin tài khoản bác sĩ!');
          setLoading(false);
        }
      })
      .catch(() => {
        if (!active) return;
        toast.error('Không thể tải thông tin hồ sơ bác sĩ!');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Fetch Slots when date or doctorId changes
  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    let active = true;
    doctorService
      .getWorkSchedules(doctorId, selectedDate)
      .then((res) => {
        if (!active) return;
        if (res.result && res.result.length > 0) {
          const schedule = res.result[0];
          setSlots(schedule.slots || []);
        } else {
          setSlots([]);
        }
      })
      .catch(() => {
        if (!active) return;
        toast.error('Không thể tải ca khám từ hệ thống!');
        setSlots([]);
      })
      .finally(() => {
        if (active) {
          setLoadingSlots(false);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [doctorId, selectedDate]);

  const handleToggleSlot = (slotId: number, startTime: string, endTime: string) => {
    doctorService
      .toggleSlotStatus(slotId)
      .then((res) => {
        const updated = res.result;
        if (!updated) return;
        setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, ...updated } : s)));
        toast.success(
          `Đã ${updated.doctorOpen ? 'mở' : 'đóng'} ca khám ${startTime.slice(0, 5)} - ${endTime.slice(0, 5)} thành công`,
        );
      })
      .catch(() => {
        toast.error('Không thể cập nhật trạng thái ca khám!');
      });
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate || !leaveReason.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin nghỉ phép');
      return;
    }
    if (leaveStartDate > leaveEndDate) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    try {
      await doctorService.createDayOff({
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason.trim(),
      });
      toast.success(
        `Đăng ký nghỉ phép thành công từ ngày ${leaveStartDate} đến ${leaveEndDate}. Đơn của bạn đang chờ Admin duyệt.`,
      );
      setLeaveStartDate('');
      setLeaveEndDate('');
      setLeaveReason('');
    } catch {
      toast.error('Không thể gửi đơn nghỉ phép. Vui lòng thử lại!');
    }
  };

  const formatDateLabel = (dateStr: string) => {
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
      <div className="flex items-center justify-center py-20 text-xs">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 text-xs">
      {/* Left 2 Columns: Schedule Config */}
      <div className="md:col-span-2 space-y-6">
        {/* Date selection card */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-foreground text-sm">Cấu hình ca khám theo ngày</h3>
          <div className="flex flex-wrap gap-2">
            {availableDates.map((date) => (
              <button
                key={date}
                onClick={() => {
                  if (selectedDate !== date) {
                    setLoadingSlots(true);
                    setSelectedDate(date);
                  }
                }}
                className={`
                  px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer
                  ${
                    selectedDate === date
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                  }
                `}
              >
                {formatDateLabel(date)}
              </button>
            ))}
          </div>
        </div>

        {/* Time slots toggles grid */}
        <div className="bg-background border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-foreground text-sm">
              Danh sách khung giờ khám ({formatDateLabel(selectedDate)})
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Click vào các ô để bật/tắt khung giờ làm việc thực tế của bạn.
            </p>
          </div>

          {loadingSlots ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {slots.map((slot) => {
                const isOpen = slot.doctorOpen;
                const label = `${String(slot.startTime).slice(0, 5)} - ${String(slot.endTime).slice(0, 5)}`;
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleToggleSlot(slot.id, slot.startTime, slot.endTime)}
                    disabled={slot.booked}
                    className={`
                      p-4 rounded-xl border text-center transition-all relative flex flex-col items-center justify-center gap-1.5
                      ${
                        slot.booked
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 cursor-not-allowed opacity-95'
                          : isOpen
                            ? 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 cursor-pointer'
                            : 'bg-muted/10 border-border text-muted-foreground hover:bg-accent/40 cursor-pointer'
                      }
                    `}
                  >
                    <span className="font-bold text-xs">{label}</span>
                    <span className="text-[9px] font-semibold">
                      {slot.booked ? '🔒 Đã có lịch' : isOpen ? '🟢 Đang mở' : '⚪ Đang đóng'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground bg-muted/5 rounded-2xl border border-dashed border-border/80">
              ⚠️ Không tìm thấy lịch trực hoặc ca khám được phân công cho ngày này.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Day Off/Leave Registration */}
      <div className="bg-background border border-border rounded-2xl p-6 space-y-4 shadow-sm h-fit">
        <h3 className="font-extrabold text-foreground text-sm">Đăng ký ngày nghỉ phép</h3>
        <p className="text-[10px] text-muted-foreground leading-normal">
          Đăng ký kỳ nghỉ phép giúp hệ thống tự động khóa các khung giờ khám và thông báo tới các
          bệnh nhân đã đặt lịch trước để đổi giờ.
        </p>

        <form onSubmit={handleApplyLeave} className="space-y-4 pt-2">
          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="block font-bold text-foreground">Ngày bắt đầu</label>
            <input
              type="date"
              value={leaveStartDate}
              onChange={(e) => setLeaveStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label className="block font-bold text-foreground">Ngày kết thúc</label>
            <input
              type="date"
              value={leaveEndDate}
              onChange={(e) => setLeaveEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
            />
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="block font-bold text-foreground">Lý do nghỉ phép</label>
            <textarea
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              rows={3}
              placeholder="Nhập lý do nghỉ phép..."
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md shadow-red-500/25 transition-all text-xs cursor-pointer"
          >
            Gửi yêu cầu nghỉ phép
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorSchedules;
