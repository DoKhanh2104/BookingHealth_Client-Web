import { createBrowserRouter } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout';
import RootLayout from '../../layouts/RootLayout';
import Home from '../../pages/home/Home';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import RegisterDoctor from '../../pages/auth/RegisterDoctor';
import Profile from '../../pages/profile/Profile';
import PageNotFound from '../../pages/error/PageNotFound';
import ComingSoon from '../../components/ComingSoon';

/**
 * Routes cho trang client BookingHealth
 *
 * Layout cấu trúc:
 * - RootLayout (Cập nhật tiêu đề trang trên tab)
 *     ├── "/" → ClientLayout (có Header + Footer)
 *     │     ├── index       → Home
 *     │     ├── doctors     → (TODO) Danh sách bác sĩ
 *     │     ├── doctors/:id → (TODO) Chi tiết bác sĩ
 *     │     ├── specialties → (TODO) Chuyên khoa
 *     │     ├── clinics     → (TODO) Phòng khám
 *     │     ├── screening   → (TODO) AI Sàng lọc - NHAT_KY_SANG_LOC
 *     │     ├── appointments/me → (TODO) Lịch hẹn của tôi - LICH_HEN
 *     │     ├── appointments/:id/chat → (TODO) Chat sau khám - PHONG_HOI_THOAI
 *     │     ├── profile     → (TODO) Hồ sơ cá nhân - NGUOI_DUNG
 *     │     ├── notifications → (TODO) Thông báo - THONG_BAO
 *     │     └── about       → (TODO) Về chúng tôi
 *     ├── "/login" → Login (không có Header/Footer)
 *     ├── "/register" → (TODO) Đăng ký
 *     └── "*"      → PageNotFound
 */

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <ClientLayout />,
        children: [
          // Trang chủ
          { index: true, element: <Home /> },

          // Bác sĩ - BAC_SI
          { path: 'doctors', element: <ComingSoon title="Danh sách Bác sĩ" /> },
          { path: 'doctors/:id', element: <ComingSoon title="Chi tiết Bác sĩ" /> },

          // Chuyên khoa - CHUYEN_KHOA
          { path: 'specialties', element: <ComingSoon title="Chuyên khoa" /> },
          { path: 'specialties/:id', element: <ComingSoon title="Chi tiết Chuyên khoa" /> },

          // Phòng khám - PHONG_KHAM
          { path: 'clinics', element: <ComingSoon title="Phòng khám" /> },
          { path: 'clinics/:id', element: <ComingSoon title="Chi tiết Phòng khám" /> },

          // AI Sàng lọc - NHAT_KY_SANG_LOC
          { path: 'screening', element: <ComingSoon title="AI Sàng lọc Sức khoẻ" /> },

          // Lịch hẹn - LICH_HEN
          { path: 'appointments', element: <ComingSoon title="Lịch hẹn của tôi" /> },
          { path: 'appointments/:id', element: <ComingSoon title="Chi tiết Lịch hẹn" /> },

          // Chat sau khám - PHONG_HOI_THOAI / TIN_NHAN
          { path: 'appointments/:id/chat', element: <ComingSoon title="Chat với Bác sĩ" /> },

          // Đặt lịch - booking flow
          { path: 'booking', element: <ComingSoon title="Đặt lịch khám" /> },

          // Hồ sơ cá nhân - NGUOI_DUNG
          { path: 'profile', element: <Profile /> },

          // Thông báo - THONG_BAO
          { path: 'notifications', element: <ComingSoon title="Thông báo" /> },

          // Thông tin tĩnh
          { path: 'about', element: <ComingSoon title="Về chúng tôi" /> },
          { path: 'faq', element: <ComingSoon title="Câu hỏi thường gặp" /> },
          { path: 'privacy', element: <ComingSoon title="Chính sách bảo mật" /> },
          { path: 'terms', element: <ComingSoon title="Điều khoản dịch vụ" /> },
          { path: 'guide', element: <ComingSoon title="Hướng dẫn sử dụng" /> },
          { path: 'news', element: <ComingSoon title="Tin tức" /> },
        ],
      },

      // Auth routes (không có Header/Footer)
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'register-doctor', element: <RegisterDoctor /> },

      // 404
      { path: '*', element: <PageNotFound /> },
    ],
  },
]);
