import { useNavigate } from 'react-router-dom';
import type { ComponentType } from 'react';
import {
  SearchIcon,
  CalendarIcon,
  UsersIcon,
  UserIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChatBubbleIcon,
  HeartIcon,
  EyeIcon,
  StethoscopeIcon,
  BrainIcon,
  FaceSmileIcon,
  BoneIcon,
  EarIcon,
  BuildingIcon,
  ClipboardIcon,
  BellIcon,
  LockIcon,
  CheckIcon,
  SendIcon,
} from '../../components/icons';

/* ─── Data ─── */
const stats = [
  { label: 'Bác sĩ chuyên khoa', value: '500+', icon: UsersIcon },
  { label: 'Lịch hẹn đã đặt', value: '50K+', icon: CalendarIcon },
  { label: 'Chuyên khoa', value: '30+', icon: ShieldCheckIcon },
  { label: 'Phục vụ 24/7', value: '365 ngày', icon: ClockIcon },
];

const specialties: { name: string; icon: ComponentType<{ className?: string }>; desc: string }[] = [
  { name: 'Tim mạch', icon: HeartIcon, desc: 'Chẩn đoán & điều trị bệnh lý tim mạch' },
  { name: 'Thần kinh', icon: BrainIcon, desc: 'Chuyên khoa thần kinh học lâm sàng' },
  { name: 'Nội tổng quát', icon: StethoscopeIcon, desc: 'Khám & điều trị bệnh nội khoa chung' },
  { name: 'Nhi khoa', icon: FaceSmileIcon, desc: 'Chăm sóc sức khoẻ toàn diện cho trẻ em' },
  { name: 'Da liễu', icon: SparklesIcon, desc: 'Điều trị các bệnh lý về da' },
  { name: 'Cơ xương khớp', icon: BoneIcon, desc: 'Chuyên về xương khớp và cơ bắp' },
  { name: 'Mắt', icon: EyeIcon, desc: 'Chăm sóc và điều trị bệnh về mắt' },
  { name: 'Tai - Mũi - Họng', icon: EarIcon, desc: 'Điều trị bệnh lý TMH chuyên sâu' },
];

const featuredDoctors = [
  {
    name: 'ThS. BS. Nguyễn Văn An',
    specialty: 'Tim mạch',
    clinic: 'Phòng khám Đa khoa Quốc tế',
    rating: 4.9,
    reviews: 128,
    experience: '12 năm kinh nghiệm',
  },
  {
    name: 'BS. CKII. Trần Thị Bình',
    specialty: 'Nhi khoa',
    clinic: 'Phòng khám Nhi Đồng',
    rating: 4.8,
    reviews: 95,
    experience: '15 năm kinh nghiệm',
  },
  {
    name: 'PGS. TS. Lê Minh Châu',
    specialty: 'Thần kinh',
    clinic: 'Bệnh viện Bạch Mai',
    rating: 5.0,
    reviews: 214,
    experience: '20 năm kinh nghiệm',
  },
];

const steps = [
  {
    step: '01',
    title: 'Chọn bác sĩ hoặc chuyên khoa',
    desc: 'Tìm kiếm bác sĩ phù hợp theo chuyên khoa, phòng khám hoặc khu vực của bạn.',
  },
  {
    step: '02',
    title: 'Chọn khung giờ khám',
    desc: 'Xem lịch trống của bác sĩ và chọn thời gian phù hợp với lịch của bạn.',
  },
  {
    step: '03',
    title: 'Xác nhận & đặt lịch',
    desc: 'Điền thông tin cá nhân, mô tả triệu chứng và xác nhận lịch hẹn.',
  },
  {
    step: '04',
    title: 'Đến khám & nhận kết quả',
    desc: 'Đến đúng giờ hẹn và nhận hướng dẫn điều trị từ bác sĩ.',
  },
];

const testimonials = [
  {
    name: 'Nguyễn Thị Hoa',
    role: 'Bệnh nhân',
    content:
      'Dịch vụ tuyệt vời! Tôi đặt lịch khám chỉ trong 2 phút, bác sĩ rất tận tâm và chuyên nghiệp.',
    rating: 5,
  },
  {
    name: 'Trần Văn Minh',
    role: 'Bệnh nhân',
    content: 'Ứng dụng rất dễ dùng, thông tin bác sĩ đầy đủ và minh bạch. Sẽ tiếp tục sử dụng!',
    rating: 5,
  },
  {
    name: 'Phạm Lan Anh',
    role: 'Phụ huynh',
    content:
      'Đặt lịch cho con khám nhi rất nhanh. Nhân viên hỗ trợ nhiệt tình, cảm ơn BookingHealth!',
    rating: 5,
  },
];

const chatFeatures = [
  { icon: ChatBubbleIcon, label: 'Nhắn tin sau khám', desc: 'Hỏi bác sĩ mọi thắc mắc' },
  { icon: ClipboardIcon, label: 'Đơn thuốc số', desc: 'Xem lại kết quả khám' },
  { icon: BellIcon, label: 'Thông báo tức thì', desc: 'Nhận phản hồi nhanh chóng' },
  { icon: LockIcon, label: 'Bảo mật tuyệt đối', desc: 'Dữ liệu được mã hoá' },
];

/** Lấy 2 chữ cái đầu của tên để làm avatar chữ. */
const initials = (name: string) =>
  name
    .replace(/^(ThS\.|BS\.|CKII\.|PGS\.|TS\.|CKI\.|GS\.)\s*/gi, '')
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/* ─── Component ─── */
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="bg-muted py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <div className="badge bg-primary/10 text-primary">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Nền tảng y tế số #1 Đà Nẵng
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                Đặt lịch khám <span className="text-primary">nhanh chóng</span> và dễ dàng
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Kết nối với hàng trăm bác sĩ chuyên khoa hàng đầu. Đặt lịch hẹn chỉ trong vài bước,
                nhận kết quả nhanh chóng và theo dõi sức khoẻ mọi lúc mọi nơi.
              </p>

              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-3 card p-2 shadow-sm max-w-xl">
                <div className="flex items-center gap-2 flex-1 px-3 text-muted-foreground">
                  <SearchIcon className="w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm bác sĩ, chuyên khoa, phòng khám..."
                    className="flex-1 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none bg-transparent py-2"
                  />
                </div>
                <button
                  id="hero-search-btn"
                  onClick={() => navigate('/doctors')}
                  className="btn btn-primary btn-md flex-shrink-0"
                >
                  Tìm kiếm
                </button>
              </div>

              {/* Quick links */}
              <div className="flex flex-wrap gap-2">
                {['Tim mạch', 'Nhi khoa', 'Thần kinh', 'Da liễu'].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => navigate('/specialties')}
                    className="badge bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer px-4 py-1.5"
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* Right illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Main card */}
                <div className="card p-6 space-y-5 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">BS. Nguyễn Văn An</p>
                      <p className="text-xs text-muted-foreground">Chuyên khoa Tim mạch</p>
                    </div>
                    <span className="badge bg-green-100 text-green-600 ml-auto">Còn trống</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['08:00', '09:30', '10:00', '11:00', '14:00', '15:30'].map((t) => (
                      <div
                        key={t}
                        className={`text-center py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors
                          ${t === '09:30' ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground hover:bg-primary/10 hover:text-primary'}`}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary btn-md btn-block">Xác nhận đặt lịch</button>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-3 -right-3 badge bg-secondary text-secondary-foreground shadow-md px-3 py-1.5">
                  <CheckIcon className="w-3.5 h-3.5" />
                  Lịch hẹn đã xác nhận
                </div>
                <div className="absolute -bottom-3 -left-3 badge card shadow-md text-foreground px-3 py-1.5">
                  <StarIcon filled className="w-3.5 h-3.5 text-amber-400" />
                  4.9/5 · 128 đánh giá
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-12 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center space-y-2">
                  <div className="flex justify-center text-primary-foreground/70">
                    <Icon className="w-7 h-7" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-primary-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-primary-foreground/70 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SPECIALTIES ═══════════════ */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Chuyên khoa</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Khám theo chuyên khoa
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Chọn chuyên khoa phù hợp để tìm bác sĩ và đặt lịch khám nhanh nhất
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map((sp) => {
              const Icon = sp.icon;
              return (
                <button
                  key={sp.name}
                  onClick={() => navigate(`/specialties?name=${encodeURIComponent(sp.name)}`)}
                  className="group card card-hover p-5 text-left hover:border-primary/40 cursor-pointer"
                >
                  <div className="w-11 h-11 mb-3 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {sp.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{sp.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/specialties')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
            >
              Xem tất cả chuyên khoa <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Quy trình</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Đặt lịch chỉ trong 4 bước
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center space-y-4">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-0.5 bg-border" />
                )}
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-primary">{s.step}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm leading-snug">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED DOCTORS ═══════════════ */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">
                Bác sĩ nổi bật
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Gặp gỡ các chuyên gia
              </h2>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer flex-shrink-0"
            >
              Xem tất cả <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((doc) => (
              <div
                key={doc.name}
                className="card card-hover p-6 hover:-translate-y-0.5 transition-all cursor-pointer group"
                onClick={() => navigate('/doctors')}
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                      {doc.name}
                    </p>
                    <span className="badge bg-primary/10 text-primary mt-1">{doc.specialty}</span>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 truncate">
                  <BuildingIcon className="w-4 h-4 flex-shrink-0" /> {doc.clinic}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <ClockIcon className="w-4 h-4 flex-shrink-0" /> {doc.experience}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        filled={i < Math.floor(doc.rating)}
                        className="w-4 h-4 text-amber-400"
                      />
                    ))}
                    <span className="text-xs font-semibold text-foreground ml-1">{doc.rating}</span>
                    <span className="text-xs text-muted-foreground">({doc.reviews})</span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/login');
                    }}
                  >
                    Đặt lịch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Đánh giá</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Bệnh nhân nói gì về chúng tôi
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card bg-muted p-6 space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <StarIcon key={i} filled className="w-4 h-4 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed italic">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ AI SCREENING ═══════════════ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - content */}
            <div className="space-y-6">
              <div className="badge bg-secondary/10 text-secondary">
                <SparklesIcon className="w-4 h-4" />
                Tính năng mới · AI Sàng lọc
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Không biết khám <span className="text-secondary">chuyên khoa nào?</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Hệ thống AI của chúng tôi sẽ phân tích triệu chứng của bạn và gợi ý chuyên khoa phù
                hợp nhất. Nhanh chóng, chính xác và hoàn toàn miễn phí.
              </p>
              <ul className="space-y-3">
                {[
                  'Mô tả triệu chứng bằng ngôn ngữ tự nhiên',
                  'AI phân tích và gợi ý chuyên khoa trong vài giây',
                  'Kết nối ngay với bác sĩ phù hợp',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="w-5 h-5 bg-secondary/15 text-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                id="ai-screening-btn"
                onClick={() => navigate('/screening')}
                className="btn btn-secondary btn-lg"
              >
                <SparklesIcon className="w-4 h-4" />
                Thử ngay miễn phí
              </button>
            </div>

            {/* Right - demo UI */}
            <div className="card bg-muted p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-9 h-9 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">AI Sàng lọc sức khoẻ</p>
                  <p className="text-xs text-muted-foreground">Powered by AI</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-background border border-border rounded-xl rounded-tl-sm px-4 py-3 text-sm text-foreground max-w-[85%]">
                  Gần đây tôi hay bị đau đầu, chóng mặt và mờ mắt...
                </div>
                <div className="bg-secondary/10 rounded-xl rounded-tr-sm px-4 py-3 text-sm text-foreground max-w-[85%] ml-auto border border-secondary/20">
                  <p className="font-semibold text-secondary mb-1">Gợi ý chuyên khoa:</p>
                  <p>
                    Các triệu chứng của bạn có thể liên quan đến <strong>Thần kinh</strong> hoặc{' '}
                    <strong>Mắt</strong>. Nên khám sớm!
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="btn btn-primary btn-sm btn-block flex-1">
                    Đặt lịch khám Thần kinh
                  </button>
                  <button className="btn btn-outline btn-sm flex-1">Xem thêm</button>
                </div>
              </div>
              <div className="flex items-center gap-2 card px-4 py-2.5">
                <input
                  type="text"
                  placeholder="Nhập triệu chứng của bạn..."
                  className="flex-1 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none bg-transparent"
                />
                <button className="text-secondary cursor-pointer" aria-label="Gửi">
                  <SendIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CHAT SUPPORT ═══════════════ */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - chat demo */}
            <div className="card p-5 space-y-4 order-2 lg:order-1">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">BS. Nguyễn Văn An</p>
                  <p className="flex items-center gap-1 text-xs text-green-500 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Đang trực tuyến
                  </p>
                </div>
              </div>
              <div className="space-y-3 min-h-[180px]">
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 text-xs text-foreground max-w-[75%]">
                    Xin chào! Bạn cần hỗ trợ gì không?
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm px-3 py-2 text-xs max-w-[75%]">
                    Bác sĩ ơi, sau khi khám tôi vẫn còn thắc mắc về đơn thuốc ạ
                  </div>
                  <div className="w-7 h-7 bg-secondary/10 text-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 text-xs text-foreground max-w-[75%]">
                    Dạ bạn cứ hỏi nhé, mình sẽ giải thích rõ hơn!
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5 border border-border">
                <input
                  type="text"
                  placeholder="Nhắn tin với bác sĩ..."
                  className="flex-1 text-xs outline-none bg-transparent text-foreground placeholder:text-muted-foreground/60"
                />
                <button
                  className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground cursor-pointer hover:bg-primary-hover transition-colors"
                  aria-label="Gửi"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right - content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="badge bg-primary/10 text-primary">
                <ChatBubbleIcon className="w-4 h-4" />
                Tư vấn trực tiếp
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Chat trực tiếp <span className="text-primary">với bác sĩ của bạn</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Sau mỗi buổi khám, bạn có thể tiếp tục trao đổi với bác sĩ qua hệ thống chat tích
                hợp. Hỏi về đơn thuốc, tái khám hay bất kỳ thắc mắc nào — ngay trong ứng dụng.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {chatFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="card p-4 space-y-2">
                      <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-foreground">{f.label}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Sẵn sàng chăm sóc sức khoẻ của bạn?
          </h2>
          <p className="text-white/80 text-base sm:text-lg">
            Đăng ký ngay hôm nay để đặt lịch khám với các bác sĩ hàng đầu. Hoàn toàn miễn phí!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/doctors')}
              className="btn btn-lg bg-white text-primary hover:bg-white/90"
            >
              Tìm bác sĩ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
