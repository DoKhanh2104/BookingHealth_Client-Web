import apiClient from '../api/apiClient';
import type {
  ApiResponse,
  PageResponse,
  Appointment,
  BookAppointmentRequest,
  DoctorDashboardResponse,
} from '../types';

export const appointmentService = {
  /** POST /appointments - Đặt lịch hẹn mới */
  book: async (data: BookAppointmentRequest): Promise<ApiResponse<Appointment>> => {
    const res = await apiClient.post('/appointments', data);
    return res.data;
  },

  /** GET /appointments/me - Lịch hẹn của người dùng hiện tại */
  getMyAppointments: async (
    page = 0,
    size = 10,
    status?: number,
  ): Promise<ApiResponse<PageResponse<Appointment>>> => {
    const res = await apiClient.get('/appointments/me', {
      params: { page, size, ...(status !== undefined ? { status } : {}) },
    });
    return res.data;
  },

  /** GET /appointments/:id - Chi tiết lịch hẹn */
  getById: async (id: number): Promise<ApiResponse<Appointment>> => {
    const res = await apiClient.get(`/appointments/${id}`);
    return res.data;
  },

  /** PUT /appointments/:id/cancel - Huỷ lịch hẹn */
  cancel: async (id: number, reason?: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.put(`/appointments/${id}/cancel`, { reason });
    return res.data;
  },

  /** PUT /appointments/:id/confirm - Duyệt lịch hẹn */
  confirm: async (id: number): Promise<ApiResponse<void>> => {
    const res = await apiClient.put(`/appointments/${id}/confirm`);
    return res.data;
  },

  /** PUT /appointments/:id/complete - Hoàn tất ca khám */
  complete: async (
    id: number,
    data: { diagnosis: string; medicine?: string; attachment?: string },
  ): Promise<ApiResponse<void>> => {
    const res = await apiClient.put(`/appointments/${id}/complete`, data);
    return res.data;
  },

  /** GET /appointments/doctor/dashboard - Thống kê dashboard của bác sĩ */
  getDashboardStats: async (): Promise<ApiResponse<DoctorDashboardResponse>> => {
    const res = await apiClient.get('/appointments/doctor/dashboard');
    return res.data;
  },
};
