import apiClient from '../api/apiClient';
import type { ApiResponse, PageResponse, Clinic } from '../types';

export const clinicService = {
  /** GET /clinics - Danh sách phòng khám */
  getAll: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<Clinic>>> => {
    const res = await apiClient.get('/clinics', { params: { page, size } });
    return res.data;
  },

  /** GET /clinics/:id - Chi tiết phòng khám */
  getById: async (id: number): Promise<ApiResponse<Clinic>> => {
    const res = await apiClient.get(`/clinics/${id}`);
    return res.data;
  },
};
