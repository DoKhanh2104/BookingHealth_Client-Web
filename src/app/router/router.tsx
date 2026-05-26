import { createBrowserRouter } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout';
import RootLayout from '../../layouts/RootLayout';
import Home from '../../pages/home/Home';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import RegisterDoctor from '../../pages/auth/RegisterDoctor';
import Profile from '../../pages/profile/Profile';
import Specialties from '../../pages/specialties/Specialties';
import PageNotFound from '../../pages/error/PageNotFound';
import ComingSoon from '../../components/ComingSoon';
import DoctorDetail from '../../pages/doctors/DoctorDetail';
import Doctors from '../../pages/doctors/Doctors';
import BookingPage from '../../pages/booking/BookingPage';
import MyAppointments from '../../pages/appointments/MyAppointments';
import PatientChat from '../../pages/chat/PatientChat';

// Doctor Portal Components
import DoctorGuard from '../../components/DoctorGuard';
import DoctorLayout from '../../layouts/DoctorLayout';
import DoctorDashboard from '../../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../../pages/doctor/DoctorAppointments';
import DoctorSchedules from '../../pages/doctor/DoctorSchedules';
import DoctorChat from '../../pages/doctor/DoctorChat';
import DoctorReviews from '../../pages/doctor/DoctorReviews';
import DoctorProfile from '../../pages/doctor/DoctorProfile';

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
          { path: 'doctors', element: <Doctors /> },
          { path: 'doctors/:id', element: <DoctorDetail /> },

          // Chuyên khoa - CHUYEN_KHOA
          { path: 'specialties', element: <Specialties /> },
          { path: 'specialties/:id', element: <ComingSoon title="Chi tiết Chuyên khoa" /> },

          // Phòng khám - PHONG_KHAM
          { path: 'clinics', element: <ComingSoon title="Phòng khám" /> },
          { path: 'clinics/:id', element: <ComingSoon title="Chi tiết Phòng khám" /> },

          // AI Sàng lọc - NHAT_KY_SANG_LOC
          { path: 'screening', element: <ComingSoon title="AI Sàng lọc Sức khoẻ" /> },

          // Lịch hẹn - LICH_HEN
          { path: 'appointments', element: <MyAppointments /> },
          { path: 'appointments/:id', element: <ComingSoon title="Chi tiết Lịch hẹn" /> },

          // Chat sau khám - PHONG_HOI_THOAI / TIN_NHAN
          { path: 'appointments/:id/chat', element: <PatientChat /> },

          // Đặt lịch - booking flow
          { path: 'booking', element: <BookingPage /> },

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

      // Doctor Portal Protected Routes
      {
        path: 'doctor',
        element: <DoctorGuard />,
        children: [
          {
            element: <DoctorLayout />,
            children: [
              { path: 'dashboard', element: <DoctorDashboard /> },
              { path: 'appointments', element: <DoctorAppointments /> },
              { path: 'schedules', element: <DoctorSchedules /> },
              { path: 'chat', element: <DoctorChat /> },
              { path: 'reviews', element: <DoctorReviews /> },
              { path: 'profile', element: <DoctorProfile /> },
            ],
          },
        ],
      },

      // 404
      { path: '*', element: <PageNotFound /> },
    ],
  },
]);
