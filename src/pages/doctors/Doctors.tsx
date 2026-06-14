import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorsHooks } from './Doctors.hooks';

/* ─── SVG Icons ─── */
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.636Z"
    />
  </svg>
);

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? '#fbbf24' : 'none'}
    stroke={filled ? '#fbbf24' : 'currentColor'}
    strokeWidth={1.5}
    className="w-3.5 h-3.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

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

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.24 2.013L10.83 21a.75.75 0 0 1-1.08-.668V14.75a2.25 2.25 0 0 0-.659-1.591L3.659 7.726A2.25 2.25 0 0 1 3 6.134V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
    />
  </svg>
);

/* ─── Custom Sort Dropdown ─── */
const SORT_OPTIONS = [
  { value: 'rating', label: 'Đánh giá tốt nhất' },
  { value: 'experience', label: 'Nhiều kinh nghiệm nhất' },
  { value: 'fee-asc', label: 'Giá khám tăng dần' },
  { value: 'fee-desc', label: 'Giá khám giảm dần' },
];

interface SortDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-semibold bg-background transition-all cursor-pointer whitespace-nowrap ${
          open
            ? 'border-primary text-primary ring-2 ring-primary/15'
            : 'border-border text-foreground hover:border-primary/50'
        }`}
      >
        <span className="text-xs font-bold text-muted-foreground">Sắp xếp:</span>
        <span>{selected.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-52 bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                opt.value === value
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-foreground hover:bg-muted font-medium'
              }`}
            >
              {opt.value === value && <span className="mr-2 text-primary">✓</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Doctors: React.FC = () => {
  const navigate = useNavigate();
  const {
    doctors,
    totalCount,
    loadingDoctors,
    filters,
    currentPage,
    totalPages,
    setCurrentPage,
    updateFilter,
    resetFilters,
  } = useDoctorsHooks();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search input state (local for debouncing/typing comfort)
  const [searchInput, setSearchInput] = useState(filters.search);

  // Trigger search on submit or blur
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search: searchInput });
  };

  const handleBook = (doctorId: number) => {
    navigate(`/doctors/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              Đội Ngũ Bác Sĩ Chuyên Gia
            </h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl">
              Tìm kiếm bác sĩ chuyên môn phù hợp, tham khảo đánh giá chân thực từ bệnh nhân trước và
              đặt lịch hẹn tư vấn sức khoẻ trực tuyến nhanh nhất.
            </p>
          </div>
          {/* Quick Stat */}
          <div className="bg-primary/10 border border-primary/20 text-primary font-bold px-4 py-2.5 rounded-2xl text-sm w-fit mx-auto md:mx-0 flex items-center gap-2">
            <span>Tổng cộng: {totalCount} bác sĩ phù hợp</span>
          </div>
        </div>

        {/* Search Bar + Sort Grid Header */}
        <div className="bg-background/80 backdrop-blur border border-border/80 rounded-3xl p-5 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên bác sĩ..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-24 py-3 text-sm text-foreground bg-background rounded-2xl border border-border outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-accent/40 border border-border rounded-2xl text-sm font-bold text-foreground cursor-pointer hover:bg-accent/60 transition-colors"
            >
              <FilterIcon />
              <span>Bộ lọc</span>
            </button>

            {/* Custom Sort Dropdown */}
            <SortDropdown
              value={filters.sortBy}
              onChange={(val) => updateFilter({ sortBy: val })}
            />
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* 1. LEFT COLUMN: Filter Sidebar (Desktop: sticky, Mobile: collapsible drawer) */}
          <div
            className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-background/80 backdrop-blur border border-border/80 rounded-3xl p-5 shadow-sm space-y-6 sticky top-20">
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm font-black text-foreground tracking-wider uppercase">
                  Bộ Lọc Tìm Kiếm
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline font-bold cursor-pointer"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Experience Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  Kinh nghiệm lâm sàng
                </label>
                <div className="space-y-2">
                  {[
                    { label: 'Tất cả kinh nghiệm', value: 'all' },
                    { label: 'Dưới 5 năm', value: 'under-5' },
                    { label: 'Từ 5 - 10 năm', value: '5-10' },
                    { label: 'Trên 10 năm', value: 'over-10' },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      <input
                        type="radio"
                        name="experience"
                        checked={filters.experienceRange === item.value}
                        onChange={() => updateFilter({ experienceRange: item.value })}
                        className="accent-primary w-4.5 h-4.5 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fee Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">Chi phí khám</label>
                <div className="space-y-2">
                  {[
                    { label: 'Tất cả mức giá', value: 'all' },
                    { label: 'Dưới 200.000đ', value: 'under-200' },
                    { label: '200.000đ - 500.000đ', value: '200-500' },
                    { label: 'Trên 500.000đ', value: 'over-500' },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      <input
                        type="radio"
                        name="fee"
                        checked={filters.feeRange === item.value}
                        onChange={() => updateFilter({ feeRange: item.value })}
                        className="accent-primary w-4.5 h-4.5 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Close Button on Mobile Filter Drawer */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden w-full py-2.5 bg-accent text-accent-foreground text-sm font-bold rounded-xl hover:bg-accent/80 transition-colors"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>

          {/* 2. RIGHT COLUMN: Doctor Grid & Pagination */}
          <div className="lg:col-span-9 space-y-8">
            {loadingDoctors ? (
              /* Loading Skeletons */
              <div className="grid sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-background/80 border border-border/80 rounded-3xl p-5 space-y-4 animate-pulse"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-accent flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-accent rounded w-3/4" />
                        <div className="h-3 bg-accent rounded w-1/2" />
                        <div className="h-3 bg-accent rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-px bg-accent" />
                    <div className="space-y-2">
                      <div className="h-3 bg-accent rounded w-5/6" />
                      <div className="h-3 bg-accent rounded w-1/2" />
                    </div>
                    <div className="h-10 bg-accent rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : doctors.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 gap-6">
                  {doctors.map((doc) => {
                    const rating = doc.averageRating || 5.0;
                    const reviewCount = doc.reviewCount || 0;
                    const expYears = doc.practiceStartDate
                      ? new Date().getFullYear() - new Date(doc.practiceStartDate).getFullYear()
                      : 0;

                    return (
                      <div
                        key={doc.id}
                        className="bg-background/80 backdrop-blur border border-border/80 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="space-y-4">
                          {/* Doctor Card Top Section */}
                          <div className="flex items-start gap-3.5">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-inner border border-border">
                              {doc.avatar ? (
                                <img
                                  src={doc.avatar}
                                  alt={doc.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserIcon className="w-8 h-8 text-primary" />
                              )}
                            </div>

                            {/* Name, Title, Experience */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {rating >= 4.8 && (
                                  <span className="bg-amber-400 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[9px] tracking-wide">
                                    ★ Đánh giá tốt
                                  </span>
                                )}
                                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                                  BS. {doc.name}
                                </h3>
                              </div>

                              {/* Specialty badges list */}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {doc.specialties.map((s) => (
                                  <span
                                    key={s.id}
                                    className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded"
                                  >
                                    {s.specialtyName}
                                  </span>
                                ))}
                              </div>

                              <p className="text-xs text-muted-foreground leading-normal mt-1.5">
                                {expYears > 0
                                  ? `${expYears} năm kinh nghiệm`
                                  : 'Bác sĩ chuyên khoa'}
                              </p>

                              {/* Rating stars */}
                              <div className="flex items-center gap-1.5 mt-2">
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} filled={i < Math.floor(rating)} />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-foreground ml-1">
                                  {rating.toFixed(1)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({reviewCount} đánh giá)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/40 my-3" />

                          {/* Clinic Info & Examination Fee */}
                          <div className="space-y-2.5 text-xs leading-relaxed text-muted-foreground">
                            {doc.clinic && (
                              <div className="flex items-start gap-2">
                                <div className="min-w-0">
                                  <p className="font-bold text-foreground truncate">
                                    {doc.clinic.clinicName}
                                  </p>
                                  <p className="text-xs text-muted-foreground/80 truncate">
                                    {doc.clinic.address}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">
                                Phí khám:{' '}
                                <span className="text-primary font-bold">
                                  {doc.examinationFee
                                    ? `${doc.examinationFee.toLocaleString('vi-VN')}đ`
                                    : 'Đang cập nhật'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Booking & Details buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-4 mt-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/doctors/${doc.id}`)}
                            className="py-3 bg-accent text-accent-foreground text-xs font-bold rounded-xl hover:bg-accent/80 transition-colors cursor-pointer text-center"
                          >
                            Xem thông tin
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBook(doc.id)}
                            className="py-3 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-sm cursor-pointer active:scale-[0.98] text-center"
                          >
                            Đặt lịch ngay
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10 pt-4 border-t border-border/50">
                    <button
                      type="button"
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                    >
                      ← Trước
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentPage(i)}
                        className={`w-10 h-10 rounded-xl text-sm font-black transition-colors cursor-pointer
                          ${
                            currentPage === i
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border border-border text-foreground hover:bg-accent'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage === totalPages - 1}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty Filter State */
              <div className="bg-background/85 border border-border/80 rounded-3xl p-16 text-center text-sm text-muted-foreground shadow-sm flex flex-col items-center justify-center gap-3">
                <span className="text-5xl block mb-2">👨‍⚕️</span>
                <h3 className="text-base font-black text-foreground">
                  Không tìm thấy bác sĩ nào phù hợp
                </h3>
                <p className="max-w-xs text-muted-foreground/80 leading-relaxed">
                  Rất tiếc, các bộ lọc tìm kiếm hiện tại của bạn không khớp với bác sĩ nào. Vui lòng
                  thiết lập lại bộ lọc hoặc điều chỉnh từ khóa tìm kiếm.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors mt-2 cursor-pointer"
                >
                  Thiết lập lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
