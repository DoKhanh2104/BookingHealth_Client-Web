import apiClient from '../api/apiClient';
import type { ApiResponse, PageResponse, Notification } from '../types';

export const notificationService = {
  /** GET /notifications/me - Danh sách thông báo của tôi */
  getMyNotifications: async (
    page = 0,
    size = 20
  ): Promise<ApiResponse<PageResponse<Notification>>> => {
    const res = await apiClient.get('/notifications/me', { params: { page, size } });
    return res.data;
  },

  /** PUT /notifications/:id/read - Đánh dấu đã đọc */
  markAsRead: async (id: number): Promise<ApiResponse<void>> => {
    const res = await apiClient.put(`/notifications/${id}/read`);
    return res.data;
  },

  /** PUT /notifications/read-all - Đánh dấu tất cả đã đọc */
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const res = await apiClient.put('/notifications/read-all');
    return res.data;
  },

  /** GET /notifications/me/unread-count - Số thông báo chưa đọc */
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const res = await apiClient.get('/notifications/me/unread-count');
    return res.data;
  },
};
