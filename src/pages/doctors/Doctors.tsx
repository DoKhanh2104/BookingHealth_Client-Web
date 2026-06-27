import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorsHooks } from './Doctors.hooks';
import {
  SearchIcon,
  StarIcon,
  UserIcon,
  FilterIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '../../components/icons';

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
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm font-semibold bg-background transition-all cursor-pointer whitespace-nowrap ${
          open
            ? 'border-primary text-primary ring-2 ring-primary/15'
            : 'border-border text-foreground hover:border-primary/50'
        }`}
      >
        <span className="text-xs font-bold text-muted-foreground">Sắp xếp:</span>
        <span>{selected.label}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-52 bg-background border border-border rounded-xl shadow-xl overflow-hidden">
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
              {opt.value === value && (
                <CheckIcon className="w-4 h-4 inline-block mr-2 text-primary" />
              )}
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
          <div className="bg-primary/10 border border-primary/20 text-primary font-bold px-4 py-2.5 rounded-full text-sm w-fit mx-auto md:mx-0 flex items-center gap-2">
            <span>Tổng cộng: {totalCount} bác sĩ phù hợp</span>
          </div>
        </div>

        {/* Search Bar + Sort Grid Header */}
        <div className="card p-5 mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên bác sĩ..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field w-full pl-10 pr-24"
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn btn-secondary btn-md lg:hidden"
            >
              <FilterIcon className="w-4 h-4" />
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
            <div className="card p-5 space-y-6 sticky top-20">
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
                className="btn btn-secondary btn-md btn-block lg:hidden"
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
                  <div key={i} className="card p-5 space-y-4 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-accent flex-shrink-0" />
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
                    <div className="h-10 bg-accent rounded-lg w-full" />
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
                        className="card card-hover p-5 flex flex-col justify-between group"
                      >
                        <div className="space-y-4">
                          {/* Doctor Card Top Section */}
                          <div className="flex items-start gap-3.5">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-inner border border-border">
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
                                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                                  BS. {doc.name}
                                </h3>
                                {rating >= 4.8 && (
                                  <span className="badge bg-amber-400 text-amber-950 inline-flex items-center gap-1">
                                    <StarIcon filled className="w-3 h-3" />
                                    Đánh giá tốt
                                  </span>
                                )}
                              </div>

                              {/* Specialty badges list */}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {doc.specialties.map((s) => (
                                  <span key={s.id} className="badge bg-primary/5 text-primary">
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
                                <div className="flex gap-0.5 text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      filled={i < Math.floor(rating)}
                                      className="w-3.5 h-3.5"
                                    />
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

                        {/* Booking button → trang chi tiết bác sĩ (chọn khung giờ mới yêu cầu đăng nhập) */}
                        <div className="pt-4 mt-3">
                          <button
                            type="button"
                            onClick={() => handleBook(doc.id)}
                            className="btn btn-primary btn-md btn-block"
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
                      className="btn btn-outline btn-sm"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Trước
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentPage(i)}
                        className={`w-10 h-10 rounded-lg text-sm font-black transition-colors cursor-pointer
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
                      className="btn btn-outline btn-sm"
                    >
                      Sau
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty Filter State */
              <div className="card p-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3">
                <UserIcon className="w-12 h-12 text-muted-foreground/60 mb-2" />
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
                  className="btn btn-primary btn-md mt-2"
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
