/**
 * DatePicker — lịch chọn ngày tự build, đồng bộ design system (thay cho <input type="date">).
 *
 * API kiểu value-based để dễ thay thế:
 *   <DatePicker value={ymd} onChange={(v) => setYmd(v)} min="2026-01-01" max={...} />
 * value / onChange dùng định dạng 'YYYY-MM-DD' (giống native date input).
 */
import { useEffect, useRef, useState } from 'react';
import { CalendarIcon } from './icons';
import { pad, toYMD, todayYMD } from '../utils/date';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/* ── Helpers (để new Date() nằm ngoài render, tránh lỗi "impure in render") ── */
const parseYMD = (s?: string): Date | null => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
};
const formatDisplay = (s?: string): string => {
  const d = parseYMD(s);
  return d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : '';
};
const firstOfMonthFor = (value?: string): Date => {
  const d = parseYMD(value) ?? new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const Chevron = ({ double = false, left = false }: { double?: boolean; left?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-4 h-4 ${left ? 'rotate-180' : ''}`}
  >
    {double ? (
      <>
        <path d="m7 18 6-6-6-6" />
        <path d="m13 18 6-6-6-6" />
      </>
    ) : (
      <path d="m9 18 6-6-6-6" />
    )}
  </svg>
);

const DatePicker = ({
  value,
  onChange,
  min,
  max,
  placeholder = 'dd/mm/yyyy',
  id,
  disabled = false,
  error = false,
  className = '',
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => firstOfMonthFor(value));
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi click ra ngoài / nhấn Escape
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleToggle = () => {
    if (disabled) return;
    if (!open) setView(firstOfMonthFor(value)); // mở: nhảy tới tháng của ngày đang chọn
    setOpen((o) => !o);
  };

  const y = view.getFullYear();
  const m = view.getMonth();
  const todayStr = todayYMD();
  const minD = parseYMD(min);
  const maxD = parseYMD(max);
  const isDisabledDay = (d: Date): boolean => Boolean((minD && d < minD) || (maxD && d > maxD));

  // Lưới 42 ô, bắt đầu từ Thứ 2
  const firstWeekday = (new Date(y, m, 1).getDay() + 6) % 7; // Mon=0..Sun=6
  const gridStart = new Date(y, m, 1 - firstWeekday);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }

  const selectDay = (d: Date) => {
    if (isDisabledDay(d)) return;
    onChange(toYMD(d));
    setOpen(false);
  };

  const goToday = () => {
    const t = parseYMD(todayStr);
    if (!t) return;
    if (isDisabledDay(t)) {
      setView(new Date(t.getFullYear(), t.getMonth(), 1));
      return;
    }
    onChange(todayStr);
    setOpen(false);
  };

  const clear = () => {
    onChange('');
    setOpen(false);
  };

  const navBtn =
    'p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={handleToggle}
        className={`input-field flex items-center justify-between text-left
          ${error ? 'border-red-400 focus:border-red-500' : ''}
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground/60'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <CalendarIcon className="w-5 h-5 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 card shadow-lg p-3"
          role="dialog"
        >
          {/* Header điều hướng */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setView(new Date(y - 1, m, 1))}
                className={navBtn}
                aria-label="Năm trước"
              >
                <Chevron double left />
              </button>
              <button
                type="button"
                onClick={() => setView(new Date(y, m - 1, 1))}
                className={navBtn}
                aria-label="Tháng trước"
              >
                <Chevron left />
              </button>
            </div>
            <span className="text-sm font-bold text-foreground">
              Tháng {m + 1} {y}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setView(new Date(y, m + 1, 1))}
                className={navBtn}
                aria-label="Tháng sau"
              >
                <Chevron />
              </button>
              <button
                type="button"
                onClick={() => setView(new Date(y + 1, m, 1))}
                className={navBtn}
                aria-label="Năm sau"
              >
                <Chevron double />
              </button>
            </div>
          </div>

          {/* Thứ trong tuần */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="text-center text-[11px] font-semibold text-muted-foreground py-1"
              >
                {w}
              </div>
            ))}
          </div>

          {/* Lưới ngày */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((d, i) => {
              const dStr = toYMD(d);
              const inMonth = d.getMonth() === m;
              const isSelected = value === dStr;
              const isToday = todayStr === dStr;
              const dayDisabled = isDisabledDay(d);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={dayDisabled}
                  onClick={() => selectDay(d)}
                  className={`h-9 w-full rounded-lg text-sm font-medium transition-colors
                    ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-bold'
                        : dayDisabled
                          ? 'text-muted-foreground/30 cursor-not-allowed'
                          : inMonth
                            ? 'text-foreground hover:bg-primary/10 cursor-pointer'
                            : 'text-muted-foreground/40 hover:bg-accent cursor-pointer'
                    }
                    ${isToday && !isSelected ? 'ring-1 ring-primary/50' : ''}`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={clear}
              className="text-xs font-semibold text-primary hover:text-primary-hover cursor-pointer"
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={goToday}
              className="text-xs font-semibold text-primary hover:text-primary-hover cursor-pointer"
            >
              Hôm nay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
