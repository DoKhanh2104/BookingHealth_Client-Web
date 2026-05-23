import apiClient from '../api/apiClient';
import type { ApiResponse, PageResponse, Specialty } from '../types';

export const specialtyService = {
  /** GET /specialties - Lấy danh sách chuyên khoa (public) */
  getAll: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<Specialty>>> => {
    const res = await apiClient.get('/specialties', { params: { page, size } });
    return res.data;
  },

  /** GET /specialties/:id */
  getById: async (id: number): Promise<ApiResponse<Specialty>> => {
    const res = await apiClient.get(`/specialties/${id}`);
    return res.data;
  },
};
