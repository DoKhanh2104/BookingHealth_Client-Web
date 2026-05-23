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

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', {
      username: data.phone,
      password: data.password,
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
   * Lấy URL Google OAuth để redirect
   */
  getGoogleOAuthUrl: (): string => {
    return `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  },
};
