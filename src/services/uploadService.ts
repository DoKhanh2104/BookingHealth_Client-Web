import apiClient from '../api/apiClient';
import type { ApiResponse } from '../types';

export const uploadService = {
  /** POST /upload - Upload file đính kèm, ảnh chụp, kết quả hoặc chứng chỉ (PDF/Ảnh) */
  uploadFile: async (file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
