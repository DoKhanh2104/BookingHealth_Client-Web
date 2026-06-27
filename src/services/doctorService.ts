import apiClient from '../api/apiClient';
import type {
  ApiResponse,
  PageResponse,
  Doctor,
  DoctorReview,
  CreateReviewRequest,
  WorkSchedule,
  AppointmentSlot,
  DayOffResponse,
} from '../types';

export interface DoctorFilterParams {
  page?: number;
  size?: number;
  search?: string;
  specialtyId?: number;
  clinicId?: number;
}

/** Hồ sơ đăng ký bác sĩ của chính user (để xem trạng thái / nộp lại khi bị từ chối). */
export interface MyDoctorApplication {
  doctorId: number;
  status: number; // 0=PENDING, 1=VERIFIED, 2=REJECTED, 3=LOCKED
  rejectReason?: string | null;
  name: string;
  phone: string;
  email: string;
  avatar?: string | null;
  practiceLicenseNumber: string;
  practiceStartDate: string;
  biography?: string | null;
  practiceLicenseImage?: string | null;
  clinicId?: number | null;
  clinicName?: string | null;
  specialtyIds: number[];
  specialtyNames: string[];
}

export const doctorService = {
  /** GET /doctors/me/application - Hồ sơ đăng ký bác sĩ của user hiện tại (null nếu chưa nộp) */
  getMyApplication: async (): Promise<ApiResponse<MyDoctorApplication | null>> => {
    const res = await apiClient.get('/doctors/me/application');
    return res.data;
  },

  /** GET /doctors - Danh sách bác sĩ với filter */
  getAll: async (params: DoctorFilterParams = {}): Promise<ApiResponse<PageResponse<Doctor>>> => {
    const res = await apiClient.get('/doctors', { params: { page: 0, size: 10, ...params } });
    return res.data;
  },

  /** GET /doctors/:id - Chi tiết bác sĩ */
  getById: async (id: number): Promise<ApiResponse<Doctor>> => {
    const res = await apiClient.get(`/doctors/${id}`);
    return res.data;
  },

  /** GET /doctors/:id/work-schedules - Lịch làm việc của bác sĩ (theo ngày) */
  getWorkSchedules: async (
    doctorId: number,
    date: string,
  ): Promise<ApiResponse<WorkSchedule[]>> => {
    const res = await apiClient.get(`/doctors/${doctorId}/work-schedules`, { params: { date } });
    return res.data;
  },

  /** GET /doctors/:id/reviews - Đánh giá của bác sĩ */
  getReviews: async (
    doctorId: number,
    page = 0,
    size = 10,
  ): Promise<ApiResponse<PageResponse<DoctorReview>>> => {
    const res = await apiClient.get(`/doctors/${doctorId}/reviews`, { params: { page, size } });
    return res.data;
  },

  /** POST /reviews - Tạo đánh giá sau khi khám xong */
  createReview: async (data: CreateReviewRequest): Promise<ApiResponse<DoctorReview>> => {
    const res = await apiClient.post('/reviews', data);
    return res.data;
  },

  /** PATCH /doctors/me/schedule-slots/:id - Bác sĩ bật/tắt ca khám */
  toggleSlotStatus: async (slotId: number): Promise<ApiResponse<AppointmentSlot>> => {
    const res = await apiClient.patch(`/doctors/me/schedule-slots/${slotId}`);
    return res.data;
  },

  /** POST /doctors/me/day-offs - Bác sĩ gửi đơn nghỉ phép */
  createDayOff: async (data: {
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<ApiResponse<DayOffResponse>> => {
    const res = await apiClient.post('/doctors/me/day-offs', data);
    return res.data;
  },

  /** GET /doctors/me/day-offs - Bác sĩ xem lịch sử đơn nghỉ phép */
  getMyDayOffs: async (): Promise<ApiResponse<DayOffResponse[]>> => {
    const res = await apiClient.get('/doctors/me/day-offs');
    return res.data;
  },

  /** PUT /doctors/:id/profile - Cập nhật tiểu sử bác sĩ */
  updateProfile: async (id: number, data: { biography: string }): Promise<ApiResponse<Doctor>> => {
    const res = await apiClient.put(`/doctors/${id}/profile`, data);
    return res.data;
  },

  /** POST /doctors/:id/qualifications - Đăng ký thêm chứng chỉ mới */
  addQualification: async (
    id: number,
    data: { degree: string; issueDate: string; attachmentUrl?: string },
  ): Promise<ApiResponse<unknown>> => {
    const res = await apiClient.post(`/doctors/${id}/qualifications`, data);
    return res.data;
  },
};
