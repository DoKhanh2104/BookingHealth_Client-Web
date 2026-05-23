import apiClient from '../api/apiClient';
import type { ApiResponse, ScreeningLog, ScreeningRequest, ScreeningResult } from '../types';

export const screeningService = {
  /**
   * POST /screening
   * Gửi triệu chứng để AI gợi ý chuyên khoa phù hợp (NHAT_KY_SANG_LOC)
   */
  analyze: async (data: ScreeningRequest): Promise<ApiResponse<ScreeningResult>> => {
    const res = await apiClient.post('/screening', data);
    return res.data;
  },

  /**
   * GET /screening/history
   * Lịch sử sàng lọc của người dùng
   */
  getHistory: async (): Promise<ApiResponse<ScreeningLog[]>> => {
    const res = await apiClient.get('/screening/history');
    return res.data;
  },
};
