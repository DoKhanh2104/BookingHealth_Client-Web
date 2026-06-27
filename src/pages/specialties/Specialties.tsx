import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpecialtiesHooks } from './Specialties.hooks';
import {
  SearchIcon,
  StarIcon,
  UserIcon,
  ArrowRightIcon,
  HeartIcon,
  EyeIcon,
  SparklesIcon,
  StethoscopeIcon,
  MedicalIcon,
  BrainIcon,
  FaceSmileIcon,
  BoneIcon,
  EarIcon,
  ToothIcon,
  FemaleIcon,
  AppleIcon,
  LeafIcon,
  ActivityIcon,
  BeakerIcon,
  DropletIcon,
  BoltIcon,
} from '../../components/icons';

type SpecIconType = React.FC<{ className?: string }>;

// Map từ khóa (không dấu) → icon. Khớp theo thứ tự: cụ thể trước, chung sau.
const SPECIALTY_ICON_RULES: { keywords: string[]; icon: SpecIconType }[] = [
  { keywords: ['tim', 'mach', 'huyet ap'], icon: HeartIcon },
  { keywords: ['than kinh'], icon: BrainIcon },
  { keywords: ['tam than', 'tam ly', 'tam benh'], icon: BrainIcon },
  { keywords: ['nhi', 'tre em'], icon: FaceSmileIcon },
  { keywords: ['rang', 'nha khoa', 'ham mat'], icon: ToothIcon }, // trước "mat" để "Răng hàm mặt" không thành Mắt
  { keywords: ['mat', 'nhan khoa', 'thi luc'], icon: EyeIcon },
  { keywords: ['da lieu', 'tham my'], icon: SparklesIcon },
  { keywords: ['tai mui hong', 'tai - mui', 'tai mui', 'tmh'], icon: EarIcon },
  { keywords: ['xuong', 'khop', 'chan thuong', 'chinh hinh', 'co xuong'], icon: BoneIcon },
  { keywords: ['san', 'phu khoa'], icon: FemaleIcon },
  { keywords: ['dinh duong'], icon: AppleIcon },
  { keywords: ['co truyen', 'dong y', 'cham cuu'], icon: LeafIcon },
  { keywords: ['phuc hoi', 'vat ly tri lieu', 'tri lieu'], icon: ActivityIcon },
  { keywords: ['xet nghiem', 'can lam sang', 'giai phau benh'], icon: BeakerIcon },
  {
    keywords: ['huyet hoc', 'tiet nieu', 'than - tiet nieu', 'than tiet nieu', 'than'],
    icon: DropletIcon,
  },
  { keywords: ['cap cuu', 'hoi suc'], icon: BoltIcon },
  { keywords: ['ho hap', 'phoi'], icon: StethoscopeIcon },
  { keywords: ['noi', 'tong quat', 'tieu hoa', 'noi tiet', 'gan'], icon: StethoscopeIcon },
];

// Bỏ dấu tiếng Việt để khớp từ khóa ổn định
const removeDiacritics = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

// Trả về icon component theo chuyên khoa
const getSpecialtyIcon = (name: string): SpecIconType => {
  const n = removeDiacritics(name.toLowerCase());
  for (const rule of SPECIALTY_ICON_RULES) {
    if (rule.keywords.some((k) => n.includes(k))) {
      return rule.icon;
    }
  }
  // Không khớp → icon y tế chung
  return MedicalIcon;
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
            <div className="card p-4 space-y-3">
              <span className="text-sm font-bold text-foreground">Tìm kiếm chuyên khoa</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <SearchIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Ví dụ: Tim mạch, Nhi khoa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Specialties Listing */}
            <div className="card p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-sm font-black text-foreground tracking-wider uppercase">
                  Danh sách chuyên khoa
                </span>
                <span className="badge bg-primary/10 text-primary">
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
                    const SpecIcon = getSpecialtyIcon(spec.specialtyName);
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => handleSelectSpecialty(spec)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-left border transition-all duration-300 group cursor-pointer
                          ${
                            isSelected
                              ? 'bg-primary/10 border-primary/50 text-primary shadow-sm'
                              : 'bg-background border-border hover:border-primary/30 hover:bg-accent/40 text-muted-foreground'
                          }`}
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 text-primary border border-border transition-transform group-hover:scale-105">
                          <SpecIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-bold leading-snug transition-colors group-hover:text-primary ${isSelected ? 'text-primary' : 'text-foreground'}`}
                          >
                            {spec.specialtyName}
                          </p>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-muted-foreground/60" />
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
                    const SpecIcon = getSpecialtyIcon(spec.specialtyName);
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => handleSelectSpecialty(spec)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border snap-start transition-all cursor-pointer
                          ${
                            isSelected
                              ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm'
                              : 'bg-background border-border text-muted-foreground'
                          }`}
                      >
                        <SpecIcon className="w-4 h-4" />
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
                <div className="card p-6 sm:p-8 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {(() => {
                      const BannerIcon = getSpecialtyIcon(selectedSpecialty.specialtyName);
                      return (
                        <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-primary/10 text-primary border border-border">
                          <BannerIcon className="w-6 h-6" />
                        </div>
                      );
                    })()}
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
                          className="card card-hover p-5 flex flex-col justify-between group"
                        >
                          <div className="space-y-4">
                            {/* Doctor Header Profile */}
                            <div className="flex items-start gap-3.5">
                              {/* Avatar wrapper */}
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border border-border">
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
                                      <StarIcon
                                        key={i}
                                        filled={i < Math.floor(rating)}
                                        className="w-3.5 h-3.5 text-amber-400"
                                      />
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

                          {/* Action Button → trang chi tiết bác sĩ (chọn khung giờ mới yêu cầu đăng nhập) */}
                          <div className="pt-4 mt-2">
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
                ) : (
                  <div className="card p-16 text-center text-xs text-muted-foreground leading-relaxed animate-fadeIn">
                    <span className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                      <UserIcon className="w-6 h-6" />
                    </span>
                    Hiện tại chưa có bác sĩ nào đăng ký thuộc chuyên khoa này.
                    <br />
                    Vui lòng chọn chuyên khoa khác hoặc quay lại sau.
                  </div>
                )}
              </div>
            ) : (
              /* PLACEHOLDER State when no specialty is selected yet */
              <div className="card p-16 text-center text-xs text-muted-foreground leading-relaxed py-24 flex flex-col items-center justify-center gap-3 animate-fadeIn">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-1 text-primary">
                  <StethoscopeIcon className="w-7 h-7" />
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
