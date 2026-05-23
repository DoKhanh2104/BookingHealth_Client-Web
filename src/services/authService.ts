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
  phone: string;
}

export interface SignupPayload {
  phone: string;
  email: string;
  password: string;
  name: string;
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
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Đăng nhập bằng Google OAuth access token
   */
  loginWithGoogle: async (accessToken: string): Promise<GoogleLoginResponse> => {
    const response = await apiClient.post('/auth/google', { token: accessToken });
    return response.data;
  },

  /**
   * Lấy URL Google OAuth để redirect
   */
  getGoogleOAuthUrl: (): string => {
    return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  },
};
