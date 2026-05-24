import apiClient from '../api/apiClient';
import type { ApiResponse, User } from '../types';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userService = {
  /** GET /users/me - Lấy thông tin cá nhân */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  /** PUT /users/me - Cập nhật thông tin cá nhân */
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    const res = await apiClient.put('/users/me', data);
    return res.data;
  },

  /** PUT /users/me/password - Đổi mật khẩu */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    const res = await apiClient.put('/users/me/password', data);
    return res.data;
  },

  /** POST /users/me/avatar - Upload ảnh đại diện */
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
