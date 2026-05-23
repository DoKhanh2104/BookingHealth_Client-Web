import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const getPageTitle = (pathname: string): string => {
  const path = pathname.replace(/\/$/, '') || '/';

  if (path === '/') return 'Trang chủ';
  if (path === '/login') return 'Đăng nhập';
  if (path === '/register') return 'Đăng ký tài khoản';
  if (path === '/doctors') return 'Danh sách Bác sĩ';
  if (path.startsWith('/doctors/')) return 'Chi tiết Bác sĩ';
  if (path === '/specialties') return 'Chuyên khoa';
  if (path.startsWith('/specialties/')) return 'Chi tiết Chuyên khoa';
  if (path === '/clinics') return 'Phòng khám';
  if (path.startsWith('/clinics/')) return 'Chi tiết Phòng khám';
  if (path === '/screening') return 'AI Sàng lọc Sức khoẻ';
  if (path === '/appointments') return 'Lịch hẹn của tôi';
  if (path.startsWith('/appointments/') && path.endsWith('/chat')) return 'Chat với Bác sĩ';
  if (path.startsWith('/appointments/')) return 'Chi tiết Lịch hẹn';
  if (path === '/booking') return 'Đặt lịch khám';
  if (path === '/profile') return 'Hồ sơ cá nhân';
  if (path === '/notifications') return 'Thông báo';
  if (path === '/about') return 'Về chúng tôi';
  if (path === '/faq') return 'Câu hỏi thường gặp';
  if (path === '/privacy') return 'Chính sách bảo mật';
  if (path === '/terms') return 'Điều khoản dịch vụ';
  if (path === '/guide') return 'Hướng dẫn sử dụng';
  if (path === '/news') return 'Tin tức';

  return 'Không tìm thấy trang';
};

const RootLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const title = getPageTitle(location.pathname);
    document.title = `${title} | BookingHealth`;
  }, [location.pathname]);

  return <Outlet />;
};

export default RootLayout;
