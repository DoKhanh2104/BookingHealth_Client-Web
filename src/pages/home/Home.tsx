import { useNavigate } from 'react-router-dom';

/* ─── Icons ─── */
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
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
    className="w-4 h-4 text-amber-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
    />
  </svg>
);

/* ─── Data ─── */
const stats = [
  { label: 'Bác sĩ chuyên khoa', value: '500+', icon: <UsersIcon /> },
  { label: 'Lịch hẹn đã đặt', value: '50K+', icon: <CalendarIcon /> },
  { label: 'Chuyên khoa', value: '30+', icon: <ShieldCheckIcon /> },
  { label: 'Phục vụ 24/7', value: '365 ngày', icon: <ClockIcon /> },
];

const specialties = [
  { name: 'Tim mạch', icon: '❤️', desc: 'Chẩn đoán & điều trị bệnh lý tim mạch' },
  { name: 'Thần kinh', icon: '🧠', desc: 'Chuyên khoa thần kinh học lâm sàng' },
  { name: 'Nội tổng quát', icon: '🩺', desc: 'Khám & điều trị bệnh nội khoa chung' },
  { name: 'Nhi khoa', icon: '👶', desc: 'Chăm sóc sức khoẻ toàn diện cho trẻ em' },
  { name: 'Da liễu', icon: '✨', desc: 'Điều trị các bệnh lý về da' },
  { name: 'Cơ xương khớp', icon: '🦴', desc: 'Chuyên về xương khớp và cơ bắp' },
  { name: 'Mắt', icon: '👁️', desc: 'Chăm sóc và điều trị bệnh về mắt' },
  { name: 'Tai - Mũi - Họng', icon: '👂', desc: 'Điều trị bệnh lý TMH chuyên sâu' },
];

const featuredDoctors = [
  {
    name: 'ThS. BS. Nguyễn Văn An',
    specialty: 'Tim mạch',
    clinic: 'Phòng khám Đa khoa Quốc tế',
    rating: 4.9,
    reviews: 128,
    experience: '12 năm kinh nghiệm',
    avatar: null,
  },
  {
    name: 'BS. CKII. Trần Thị Bình',
    specialty: 'Nhi khoa',
    clinic: 'Phòng khám Nhi Đồng',
    rating: 4.8,
    reviews: 95,
    experience: '15 năm kinh nghiệm',
    avatar: null,
  },
  {
    name: 'PGS. TS. Lê Minh Châu',
    specialty: 'Thần kinh',
    clinic: 'Bệnh viện Bạch Mai',
    rating: 5.0,
    reviews: 214,
    experience: '20 năm kinh nghiệm',
    avatar: null,
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
    avatar: '🧑‍🦰',
    content:
      'Dịch vụ tuyệt vời! Tôi đặt lịch khám chỉ trong 2 phút, bác sĩ rất tận tâm và chuyên nghiệp.',
    rating: 5,
  },
  {
    name: 'Trần Văn Minh',
    role: 'Bệnh nhân',
    avatar: '👨',
    content: 'Ứng dụng rất dễ dùng, thông tin bác sĩ đầy đủ và minh bạch. Sẽ tiếp tục sử dụng!',
    rating: 5,
  },
  {
    name: 'Phạm Lan Anh',
    role: 'Phụ huynh',
    avatar: '👩',
    content:
      'Đặt lịch cho con khám nhi rất nhanh. Nhân viên hỗ trợ nhiệt tình, cảm ơn BookingHealth!',
    rating: 5,
  },
];

/* ─── Component ─── */
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-4 md:py-8 lg:py-16">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Nền tảng y tế số #1 Đà Nẵng
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight">
                Đặt lịch khám
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  nhanh chóng
                </span>
                và dễ dàng
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Kết nối với hàng trăm bác sĩ chuyên khoa hàng đầu. Đặt lịch hẹn chỉ trong vài bước,
                nhận kết quả nhanh chóng và theo dõi sức khoẻ mọi lúc mọi nơi.
              </p>

              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-background border border-border rounded-2xl p-2 shadow-lg max-w-xl">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Tìm bác sĩ, chuyên khoa, phòng khám..."
                    className="flex-1 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none bg-transparent py-2"
                  />
                </div>
                <button
                  id="hero-search-btn"
                  onClick={() => navigate('/doctors')}
                  className="flex-shrink-0 px-6 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-sm cursor-pointer"
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
                    className="px-4 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
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
                <div className="bg-background rounded-3xl shadow-2xl border border-border p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                      👨‍⚕️
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">BS. Nguyễn Văn An</p>
                      <p className="text-xs text-muted-foreground">Chuyên khoa Tim mạch</p>
                    </div>
                    <span className="ml-auto bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                      Còn trống
                    </span>
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
                  <button className="w-full py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl cursor-pointer hover:bg-primary-hover transition-colors">
                    Xác nhận đặt lịch
                  </button>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-2xl shadow-lg">
                  ✅ Lịch hẹn đã xác nhận
                </div>
                <div className="absolute -bottom-4 -left-4 bg-background border border-border text-xs font-semibold px-4 py-2 rounded-2xl shadow-lg text-foreground">
                  ⭐ 4.9/5 · 128 đánh giá
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
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="flex justify-center text-primary-foreground/70">{stat.icon}</div>
                <p className="text-3xl sm:text-4xl font-black text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/70 font-medium">{stat.label}</p>
              </div>
            ))}
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
            {specialties.map((sp) => (
              <button
                key={sp.name}
                onClick={() => navigate(`/specialties?name=${encodeURIComponent(sp.name)}`)}
                className="group bg-background border border-border rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className="text-3xl mb-3">{sp.icon}</div>
                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {sp.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{sp.desc}</p>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/specialties')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
            >
              Xem tất cả chuyên khoa <ArrowRightIcon />
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
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-black text-primary">{s.step}</span>
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
              Xem tất cả <ArrowRightIcon />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((doc) => (
              <div
                key={doc.name}
                className="bg-background border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                onClick={() => navigate('/doctors')}
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                    👨‍⚕️
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                      {doc.name}
                    </p>
                    <span className="inline-block text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full mt-1">
                      {doc.specialty}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 truncate">🏥 {doc.clinic}</p>
                <p className="text-xs text-muted-foreground mb-4">⏳ {doc.experience}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < Math.floor(doc.rating)} />
                    ))}
                    <span className="text-xs font-semibold text-foreground ml-1">{doc.rating}</span>
                    <span className="text-xs text-muted-foreground">({doc.reviews})</span>
                  </div>
                  <button
                    className="text-xs font-bold text-primary-foreground bg-primary px-3 py-1.5 rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
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
              <div key={t.name} className="bg-muted border border-border rounded-2xl p-6 space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed italic">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                    {t.avatar}
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
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1.5 rounded-full">
                <SparklesIcon />
                Tính năng mới · AI Sàng lọc
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Không biết khám
                <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  chuyên khoa nào?
                </span>
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
                    <span className="w-5 h-5 bg-secondary/15 text-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                id="ai-screening-btn"
                onClick={() => navigate('/screening')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white text-sm font-bold rounded-xl shadow-[0_8px_20px_rgba(53,166,205,0.35)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(53,166,205,0.5)] transition-all duration-300 cursor-pointer"
              >
                <SparklesIcon />
                Thử ngay miễn phí
              </button>
            </div>

            {/* Right - demo UI */}
            <div className="bg-gradient-to-br from-secondary/5 to-primary/5 border border-border rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-9 h-9 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center text-white">
                  <SparklesIcon />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">AI Sàng lọc sức khoẻ</p>
                  <p className="text-xs text-muted-foreground">Powered by AI</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-foreground max-w-[85%]">
                  Gần đây tôi hay bị đau đầu, chóng mặt và mờ mắt...
                </div>
                <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-foreground max-w-[85%] ml-auto border border-primary/20">
                  <p className="font-semibold text-primary mb-1">🧠 Gợi ý chuyên khoa:</p>
                  <p>
                    Các triệu chứng của bạn có thể liên quan đến <strong>Thần kinh</strong> hoặc{' '}
                    <strong>Mắt</strong>. Nên khám sớm!
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 py-2 text-xs font-bold text-primary-foreground bg-primary rounded-lg cursor-pointer hover:bg-primary-hover transition-colors">
                    Đặt lịch khám Thần kinh
                  </button>
                  <button className="flex-1 py-2 text-xs font-semibold text-foreground bg-muted rounded-lg cursor-pointer border border-border hover:bg-accent transition-colors">
                    Xem thêm
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5">
                <input
                  type="text"
                  placeholder="Nhập triệu chứng của bạn..."
                  className="flex-1 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none bg-transparent"
                />
                <button className="text-primary cursor-pointer">
                  <ArrowRightIcon />
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
            <div className="bg-background border border-border rounded-3xl p-5 space-y-4 order-2 lg:order-1">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                    👨‍⚕️
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">BS. Nguyễn Văn An</p>
                  <p className="text-xs text-green-500 font-medium">● Đang trực tuyến</p>
                </div>
              </div>
              <div className="space-y-3 min-h-[180px]">
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    👨‍⚕️
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-foreground max-w-[75%]">
                    Xin chào! Bạn cần hỗ trợ gì không?
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3 py-2 text-xs max-w-[75%]">
                    Bác sĩ ơi, sau khi khám tôi vẫn còn thắc mắc về đơn thuốc ạ
                  </div>
                  <div className="w-7 h-7 bg-secondary/10 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    👤
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    👨‍⚕️
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-foreground max-w-[75%]">
                    Dạ bạn cứ hỏi nhé, mình sẽ giải thích rõ hơn! 😊
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5 border border-border">
                <input
                  type="text"
                  placeholder="Nhắn tin với bác sĩ..."
                  className="flex-1 text-xs outline-none bg-transparent text-foreground placeholder:text-muted-foreground/60"
                />
                <button className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white cursor-pointer hover:bg-primary-hover transition-colors">
                  <ArrowRightIcon />
                </button>
              </div>
            </div>

            {/* Right - content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                <ChatBubbleIcon />
                Tư vấn trực tiếp
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Chat trực tiếp
                <span className="block text-primary">với bác sĩ của bạn</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Sau mỗi buổi khám, bạn có thể tiếp tục trao đổi với bác sĩ qua hệ thống chat tích
                hợp. Hỏi về đơn thuốc, tái khám hay bất kỳ thắc mắc nào — ngay trong ứng dụng.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '💬', label: 'Nhắn tin sau khám', desc: 'Hỏi bác sĩ mọi thắc mắc' },
                  { icon: '📋', label: 'Đơn thuốc số', desc: 'Xem lại kết quả khám' },
                  { icon: '🔔', label: 'Thông báo tức thì', desc: 'Nhận phản hồi nhanh chóng' },
                  { icon: '🔒', label: 'Bảo mật tuyệt đối', desc: 'Dữ liệu được mã hoá' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="bg-background border border-border rounded-xl p-4 space-y-1"
                  >
                    <div className="text-xl">{f.icon}</div>
                    <p className="text-xs font-bold text-foreground">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
              {/* <button
                id="chat-feature-btn"
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-[0_8px_20px_rgba(26,113,180,0.35)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(26,113,180,0.5)] transition-all duration-300 cursor-pointer"
              >
                <ChatBubbleIcon />
                Bắt đầu ngay
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Sẵn sàng chăm sóc sức khoẻ của bạn?
          </h2>
          <p className="text-white/80 text-base sm:text-lg">
            Đăng ký ngay hôm nay để đặt lịch khám với các bác sĩ hàng đầu. Hoàn toàn miễn phí!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* <button
              id="cta-book-btn"
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-primary font-bold text-sm rounded-2xl hover:bg-white/90 transition-all duration-200 shadow-lg cursor-pointer"
            >
              Đặt lịch ngay
            </button> */}
            <button
              onClick={() => navigate('/doctors')}
              className="px-8 py-4 bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-200 cursor-pointer"
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
