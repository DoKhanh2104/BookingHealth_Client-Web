import apiClient from '../api/apiClient';

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  result?: {
    token: string;
  };
  message?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface SignupPayload {
  phone: string;
  email: string;
  password: string;
  name: string;
}

export interface DoctorSignupPayload {
  phone: string;
  email: string;
  password: string;
  name: string;
  practiceLicenseNumber: string;
  practiceStartDate: string;
  biography?: string;
  avatar?: File;
  practiceLicenseImage?: File;
  clinicId?: number;
  specialtyIds?: number[];
}

export interface SignupResponse {
  code: number;
  result?: {
    token: string;
    authenticated: boolean;
  };
  message?: string;
}

export interface GoogleLoginResponse {
  code: number;
  result?: {
    token: string;
  };
  message?: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', {
      username: data.phone,
      password: data.password,
    });
    return response.data;
  },

  signup: async (data: SignupPayload): Promise<SignupResponse> => {
    const response = await apiClient.post('/auth/signup', {
      phone: data.phone,
      email: data.email,
      password: data.password,
      name: data.name,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordPayload) => {
    // Backend: POST /auth/forgot-password → gửi email đặt lại mật khẩu
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordPayload) => {
    // Backend: POST /auth/reset-password → đặt lại mật khẩu bằng token
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Đăng nhập bằng Google OAuth access token
   */
  loginWithGoogle: async (accessToken: string): Promise<GoogleLoginResponse> => {
    const response = await apiClient.post('/auth/google', { token: accessToken });
    return response.data;
  },

  signupDoctor: async (data: FormData): Promise<SignupResponse> => {
    const response = await apiClient.post('/auth/signup-doctor', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Refresh token: lấy token mới với roles cập nhật từ server
   */
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/refresh-token');
    return response.data;
  },

  /**
   * Lấy URL Google OAuth để redirect
   */
  getGoogleOAuthUrl: (): string => {
    return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  },
};
