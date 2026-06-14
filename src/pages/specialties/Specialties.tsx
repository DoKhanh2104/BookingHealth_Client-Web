import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpecialtiesHooks } from './Specialties.hooks';

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
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-3.5 h-3.5 text-amber-400"
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

// Trả về icon và gradient theo chuyên khoa
const getSpecialtyMeta = (name: string) => {
  const n = name.toLowerCase();

  // 1. Răng - Hàm - Mặt
  if (n.includes('răng') || n.includes('rang') || n.includes('hàm') || n.includes('ham')) {
    return {
      icon: '🦷',
      color: 'from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-500/20 bg-cyan-500/5',
    };
  }

  // 2. Tim mạch
  if (n.includes('tim') || n.includes('mạch') || n.includes('mach')) {
    return {
      icon: '❤️',
      color: 'from-red-500/10 to-pink-500/10 text-red-500 border-red-500/20 bg-red-500/5',
    };
  }

  // 3. Thần kinh
  if (
    n.includes('thần kinh') ||
    n.includes('than kinh') ||
    n.includes('não') ||
    n.includes('nao')
  ) {
    return {
      icon: '🧠',
      color:
        'from-purple-500/10 to-indigo-500/10 text-purple-500 border-purple-500/20 bg-purple-500/5',
    };
  }

  // 4. Nhi khoa
  if (n.includes('nhi')) {
    return {
      icon: '👶',
      color: 'from-amber-500/10 to-yellow-500/10 text-amber-500 border-amber-500/20 bg-amber-500/5',
    };
  }

  // 5. Sản phụ khoa
  if (n.includes('sản') || n.includes('san') || n.includes('phụ') || n.includes('phu')) {
    return {
      icon: '🤰',
      color: 'from-pink-500/10 to-rose-500/10 text-pink-500 border-pink-500/20 bg-pink-500/5',
    };
  }

  // 6. Tai Mũi Họng
  if (
    n.includes('tai') ||
    n.includes('mũi') ||
    n.includes('mui') ||
    n.includes('họng') ||
    n.includes('hong')
  ) {
    return {
      icon: '👂',
      color: 'from-rose-500/10 to-pink-500/10 text-rose-500 border-rose-500/20 bg-rose-500/5',
    };
  }

  // 7. Mắt (Nhãn khoa)
  if (n.includes('mắt') || n.includes('mat')) {
    return {
      icon: '👁️',
      color: 'from-blue-500/10 to-cyan-500/10 text-blue-500 border-blue-500/20 bg-blue-500/5',
    };
  }

  // 8. Da liễu
  if (n.includes('da liễu') || n.includes('da lieu')) {
    return {
      icon: '✨',
      color:
        'from-emerald-500/10 to-green-500/10 text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    };
  }

  // 9. Cơ xương khớp
  if (n.includes('xương') || n.includes('xuong') || n.includes('khớp') || n.includes('khop')) {
    return {
      icon: '🦴',
      color:
        'from-orange-500/10 to-amber-500/10 text-orange-500 border-orange-500/20 bg-orange-500/5',
    };
  }

  // 10. Tiêu hóa
  if (
    n.includes('tiêu hóa') ||
    n.includes('tieu hoa') ||
    n.includes('dạ dày') ||
    n.includes('da day')
  ) {
    return {
      icon: '🥗',
      color:
        'from-green-500/10 to-emerald-500/10 text-green-600 border-green-500/20 bg-green-500/5',
    };
  }

  // 11. Tâm thần
  if (
    n.includes('tâm thần') ||
    n.includes('tam than') ||
    n.includes('tâm lý') ||
    n.includes('tam ly')
  ) {
    return {
      icon: '💭',
      color:
        'from-indigo-500/10 to-purple-500/10 text-indigo-500 border-indigo-500/20 bg-indigo-500/5',
    };
  }

  // 12. Chấn thương chỉnh hình
  if (
    n.includes('chấn thương') ||
    n.includes('chan thuong') ||
    n.includes('chỉnh hình') ||
    n.includes('chinh hinh')
  ) {
    return {
      icon: '🩹',
      color: 'from-amber-600/10 to-red-500/10 text-amber-600 border-amber-500/20 bg-amber-500/5',
    };
  }

  // 13. Y học cổ truyền
  if (
    n.includes('cổ truyền') ||
    n.includes('co truyen') ||
    n.includes('đông y') ||
    n.includes('dong y')
  ) {
    return {
      icon: '🌿',
      color:
        'from-emerald-600/10 to-teal-600/10 text-emerald-700 border-emerald-600/20 bg-emerald-600/5',
    };
  }

  // 14. Phục hồi chức năng
  if (
    n.includes('phục hồi') ||
    n.includes('phuc hoi') ||
    n.includes('chức năng') ||
    n.includes('chuc nang')
  ) {
    return {
      icon: '🚶',
      color: 'from-lime-500/10 to-emerald-500/10 text-lime-600 border-lime-500/20 bg-lime-500/5',
    };
  }

  // 15. Nội tổng quát
  if (
    n.includes('nội') ||
    n.includes('noi') ||
    n.includes('tổng quát') ||
    n.includes('tong quat')
  ) {
    return {
      icon: '🩺',
      color: 'from-teal-500/10 to-emerald-500/10 text-teal-500 border-teal-500/20 bg-teal-500/5',
    };
  }

  return {
    icon: '🏥',
    color: 'from-primary/10 to-secondary/10 text-primary border-primary/20 bg-primary/5',
  };
};

const Specialties: React.FC = () => {
  const navigate = useNavigate();
  const {
    specialties,
    allSpecialtiesCount,
    selectedSpecialty,
    doctors,
    loadingSpecialties,
    loadingDoctors,
    searchQuery,
    setSearchQuery,
    handleSelectSpecialty,
  } = useSpecialtiesHooks();

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
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Chuyên Khoa Y Học</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl">
            Lựa chọn chuyên khoa phù hợp để tìm kiếm bác sĩ chuyên gia và đặt lịch hẹn tư vấn sức
            khoẻ trực tuyến nhanh nhất.
          </p>
        </div>

        {/* Main Grid Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Specialties List (Sidebar on Desktop, Horizontal Scroll on Mobile) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Search Specialties Box */}
            <div className="bg-background/80 backdrop-blur border border-border/80 rounded-2xl p-4 shadow-sm space-y-3">
              <span className="text-sm font-bold text-foreground">Tìm kiếm chuyên khoa</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Ví dụ: Tim mạch, Nhi khoa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs text-foreground bg-background rounded-xl border border-border outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Specialties Listing */}
            <div className="bg-background/80 backdrop-blur border border-border/80 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-sm font-black text-foreground tracking-wider uppercase">
                  Danh sách chuyên khoa
                </span>
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                  {allSpecialtiesCount} chuyên khoa
                </span>
              </div>

              {loadingSpecialties ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  <svg
                    className="animate-spin w-6 h-6 mx-auto text-primary mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Đang tải chuyên khoa...
                </div>
              ) : specialties.length > 0 ? (
                /* Desktop Sidebar View (Hidden on mobile) */
                <div className="hidden lg:flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                  {specialties.map((spec) => {
                    const isSelected = selectedSpecialty?.id === spec.id;
                    const meta = getSpecialtyMeta(spec.specialtyName);
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => handleSelectSpecialty(spec)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left border transition-all duration-300 group cursor-pointer
                          ${
                            isSelected
                              ? 'bg-primary/10 border-primary/50 text-primary shadow-sm shadow-primary/5'
                              : 'bg-background border-border hover:border-primary/30 hover:bg-accent/40 text-muted-foreground'
                          }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br border transition-transform group-hover:scale-105 ${meta.color}`}
                        >
                          {meta.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-bold leading-snug transition-colors group-hover:text-primary ${isSelected ? 'text-primary' : 'text-foreground'}`}
                          >
                            {spec.specialtyName}
                          </p>
                        </div>
                        <span className="text-xs transition-transform group-hover:translate-x-0.5 text-muted-foreground/60">
                          →
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Không tìm thấy chuyên khoa nào.
                </div>
              )}

              {/* Mobile Horizontal Slide List (Visible only on mobile/tablet) */}
              {!loadingSpecialties && specialties.length > 0 && (
                <div className="lg:hidden flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {specialties.map((spec) => {
                    const isSelected = selectedSpecialty?.id === spec.id;
                    const meta = getSpecialtyMeta(spec.specialtyName);
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => handleSelectSpecialty(spec)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border snap-start transition-all cursor-pointer
                          ${
                            isSelected
                              ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                              : 'bg-background border-border text-muted-foreground'
                          }`}
                      >
                        <span className="text-sm">{meta.icon}</span>
                        <span className="text-xs">{spec.specialtyName}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Selected Specialty Details and Doctor List */}
          <div className="lg:col-span-8">
            {selectedSpecialty ? (
              <div className="space-y-6">
                {/* Selected Specialty Banner Card */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/15 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden animate-fadeIn">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl bg-background border shadow-inner ${getSpecialtyMeta(selectedSpecialty.specialtyName).color}`}
                    >
                      {getSpecialtyMeta(selectedSpecialty.specialtyName).icon}
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <h2 className="text-xl font-black text-foreground leading-tight">
                        Chuyên khoa {selectedSpecialty.specialtyName}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {selectedSpecialty.description ||
                          'Hệ thống các bác sĩ y tế có chuyên môn sâu, giàu kinh nghiệm, chẩn đoán và điều trị tận tâm các bệnh lý chuyên khoa.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header for Doctors listing */}
                <div className="flex items-center justify-between pb-3 border-b border-border/80">
                  <span className="text-xs font-black text-foreground uppercase tracking-wider">
                    Bác sĩ chuyên khoa ({doctors.length})
                  </span>
                </div>

                {/* Doctors List */}
                {loadingDoctors ? (
                  <div className="py-24 text-center text-xs text-muted-foreground">
                    <svg
                      className="animate-spin w-8 h-8 mx-auto text-primary mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Đang tìm kiếm bác sĩ chuyên môn...
                  </div>
                ) : doctors.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {doctors.map((doc) => {
                      const rating = doc.averageRating || 5.0;
                      const reviewCount = doc.reviewCount || 0;
                      const exp = doc.practiceStartDate
                        ? `${new Date().getFullYear() - new Date(doc.practiceStartDate).getFullYear()} năm kinh nghiệm`
                        : 'Bác sĩ chuyên môn';
                      return (
                        <div
                          key={doc.id}
                          className="bg-background/80 backdrop-blur border border-border/80 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div className="space-y-4">
                            {/* Doctor Header Profile */}
                            <div className="flex items-start gap-3.5">
                              {/* Avatar wrapper */}
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
                              <div className="min-w-0">
                                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                                  Bác sĩ {doc.name}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                                  {exp}
                                </p>
                                <div className="flex items-center gap-1 mt-1.5">
                                  <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIcon key={i} filled={i < Math.floor(rating)} />
                                    ))}
                                  </div>
                                  <span className="text-xs font-bold text-foreground ml-1">
                                    {rating.toFixed(1)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({reviewCount})
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-border/40 my-3" />

                            {/* Details: Clinic & Fee */}
                            <div className="space-y-2.5 text-xs leading-relaxed text-muted-foreground">
                              {doc.clinic && (
                                <div className="flex items-start gap-2">
                                  <div>
                                    <p className="font-bold text-foreground">
                                      {doc.clinic.clinicName}
                                    </p>
                                    <p className="text-xs text-muted-foreground/80">
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

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3 pt-4 mt-2">
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
                ) : (
                  <div className="bg-background/80 backdrop-blur border border-border/80 rounded-3xl p-16 text-center text-xs text-muted-foreground leading-relaxed animate-fadeIn">
                    <span className="text-4xl block mb-3">👨‍⚕️</span>
                    Hiện tại chưa có bác sĩ nào đăng ký thuộc chuyên khoa này.
                    <br />
                    Vui lòng chọn chuyên khoa khác hoặc quay lại sau.
                  </div>
                )}
              </div>
            ) : (
              /* PLACEHOLDER State when no specialty is selected yet */
              <div className="bg-background/80 backdrop-blur border border-border/80 rounded-3xl p-16 text-center text-xs text-muted-foreground leading-relaxed shadow-inner py-24 flex flex-col items-center justify-center gap-3 animate-fadeIn">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mb-1 text-primary shadow-sm">
                  🩺
                </div>
                <h3 className="text-sm font-black text-foreground">
                  Vui lòng chọn một Chuyên khoa
                </h3>
                <p className="max-w-xs text-muted-foreground/80 leading-relaxed">
                  Hãy chọn một chuyên khoa từ cột bên trái (hoặc vuốt ngang phía trên) để xem thông
                  tin chi tiết và danh sách bác sĩ chuyên môn hỗ trợ đặt khám.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialties;
