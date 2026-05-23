import axios from 'axios';

export const TOKEN_KEY = 'bookinghealth_admin_token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true, // Nếu BE có xài Cookie thì cứ giữ
  timeout: 10000,
});

// Thêm token vào Header trước khi gửi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Xử lý lỗi trả về (đặc biệt là lỗi 401 Hết hạn Token)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // KHÔNG redirect nếu lỗi 401 phát ra từ API Đăng nhập (vì đây là lỗi sai mật khẩu, không phải lỗi hết hạn Token)
      if (error.config && !error.config.url?.includes('/auth/login')) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
