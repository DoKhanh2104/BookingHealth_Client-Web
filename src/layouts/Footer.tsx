import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

/* ─── Icons ─── */

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
);

const footerLinks = {
  'Dịch vụ': [
    { label: 'Đặt lịch khám', href: '/booking' },
    { label: 'Tìm bác sĩ', href: '/doctors' },
    { label: 'Chuyên khoa', href: '/specialties' },
    { label: 'Phòng khám', href: '/clinics' },
  ],
  'Hỗ trợ': [
    { label: 'Câu hỏi thường gặp', href: '/faq' },
    { label: 'Hướng dẫn sử dụng', href: '/guide' },
    { label: 'Chính sách bảo mật', href: '/privacy' },
    { label: 'Điều khoản dịch vụ', href: '/terms' },
  ],
  'Về chúng tôi': [
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Đội ngũ', href: '/team' },
    { label: 'Tuyển dụng', href: '/careers' },
    { label: 'Tin tức', href: '/news' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-primary-foreground p-1.5 rounded-xl group-hover:bg-accent">
                <img src={Logo} alt="BookingHealth" className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Booking<span className="text-secondary">Health</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-background/60 max-w-xs">
              Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam. Kết nối bệnh nhân với bác sĩ
              chuyên nghiệp một cách nhanh chóng và tiện lợi.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-background/70">
                <PhoneIcon />
                <span>1800 1234 (Miễn phí)</span>
              </div>
              <div className="flex items-center gap-2 text-background/70">
                <EmailIcon />
                <span>support@bookinghealth.vn</span>
              </div>
              <div className="flex items-center gap-2 text-background/70">
                <MapPinIcon />
                <span>TP. Đà Nẵng, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-background/60 hover:text-secondary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/40">
          <p>© {new Date().getFullYear()} BookingHealth. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-background/70 transition-colors">
              Chính sách bảo mật
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-background/70 transition-colors">
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
