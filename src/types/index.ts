// ─────────────────────────────────────────────
// COMMON
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ─────────────────────────────────────────────
// USER - NGUOI_DUNG
// ─────────────────────────────────────────────

export interface User {
  id: number;
  phone: string;
  email?: string;
  name: string;
  status: number; // 0: inactive, 1: active, 2: blocked
  avatar?: string;
  roles?: Role[];
}

// ─────────────────────────────────────────────
// ROLE - VAI_TRO
// ─────────────────────────────────────────────

export interface Role {
  id: number;
  roleName: string;
  description?: string;
}

// ─────────────────────────────────────────────
// SPECIALTY - CHUYEN_KHOA
// ─────────────────────────────────────────────

export interface Specialty {
  id: number;
  specialtyName: string;
  description?: string;
}

// ─────────────────────────────────────────────
// CLINIC - PHONG_KHAM
// ─────────────────────────────────────────────

export interface Clinic {
  id: number;
  clinicName: string;
  address: string;
  longitude?: number;
  latitude?: number;
  doctorCount?: number;
}

// ─────────────────────────────────────────────
// DOCTOR - BAC_SI
// ─────────────────────────────────────────────

/**
 * TRINH_DO (Doctor Qualification/Degree)
 */
export interface DoctorQualification {
  id: number;
  doctorId: number;
  degree: string;        // tenTrinhDo
  issueDate: string;     // ngayCap (ISO date)
}

export interface Doctor {
  id: number;
  biography?: string;
  practiceStartDate?: string;
  practiceLicenseNumber?: string;
  practiceLicenseImage?: string;
  status?: number;       // trangThaiXacNhan: 0=pending,1=approved,2=rejected
  specialties: Specialty[];
  clinic?: Clinic;
  qualifications?: DoctorQualification[];
  // from User join
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  /** Derived: years of experience */
  yearsOfExperience?: number;
  /** Average rating derived from reviews */
  averageRating?: number;
  reviewCount?: number;
  /** Current examination fee (from LICH_SU_GIA_KHAM) */
  examinationFee?: number;
}

// ─────────────────────────────────────────────
// PRICE HISTORY - LICH_SU_GIA_KHAM
// ─────────────────────────────────────────────

export interface PriceHistory {
  id: number;
  doctorId: number;
  examinationFee: number; // chiPhiKham
  appliedDate: string;    // ngayApDung
  status: number;         // 0:inactive, 1:active
}

// ─────────────────────────────────────────────
// WORK SCHEDULE - LICH_LAM_VIEC
// ─────────────────────────────────────────────

export interface WorkSchedule {
  id: number;
  doctorId: number;
  workDate: string;           // ngayLamViec
  appointmentSlots: AppointmentSlot[];
}

// ─────────────────────────────────────────────
// APPOINTMENT SLOT - KHUNG_GIO
// ─────────────────────────────────────────────

export interface AppointmentSlot {
  id: number;
  startTime: string;   // thoiGianBatDau (HH:mm)
  endTime: string;     // thoiGianKetThuc (HH:mm)
  status: number;      // 0: booked, 1: available
  workScheduleId: number;
}

// ─────────────────────────────────────────────
// LEAVE DAYS - NGAY_NGHI_PHEP
// ─────────────────────────────────────────────

export interface LeaveDay {
  id: number;
  doctorId: number;
  startDate: string;
  endDate: string;
  reason?: string;
  status: number;
}

// ─────────────────────────────────────────────
// APPOINTMENT - LICH_HEN
// ─────────────────────────────────────────────

/** Appointment status values (trangThai) */
export const APPOINTMENT_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  NO_SHOW: 4,
} as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export const PAYMENT_STATUS = {
  UNPAID: 0,
  PAID: 1,
  REFUNDED: 2,
} as const;

export interface Appointment {
  id: number;
  status: AppointmentStatus;
  description?: string;
  expectedExaminationDate: string;
  actualArrivalTime?: string;
  totalAmount?: number;
  paymentMethod?: string;
  paymentStatus?: number;
  diagnosis?: string;
  medicine?: string;
  attachment?: string;
  doctor?: Doctor;
  user?: User;
  appointmentSlot?: AppointmentSlot;
}

export interface BookAppointmentRequest {
  doctorId: number;
  appointmentSlotId: number;
  expectedExaminationDate: string;
  description?: string;
}

// ─────────────────────────────────────────────
// DOCTOR REVIEW - DANH_GIA_BAC_SI
// ─────────────────────────────────────────────

export interface DoctorReview {
  id: number;
  rating: number;      // 1-5
  comment?: string;
  doctorId: number;
  userId: number;
  userName?: string;
  userAvatar?: string;
  appointmentId: number;
  createdAt?: string;
}

export interface CreateReviewRequest {
  doctorId: number;
  appointmentId: number;
  rating: number;
  comment?: string;
}

// ─────────────────────────────────────────────
// NOTIFICATION - THONG_BAO
// ─────────────────────────────────────────────

export const NOTIFICATION_TYPE = {
  APPOINTMENT: 1,
  SYSTEM: 2,
  REMINDER: 3,
} as const;

export interface Notification {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: number;        // loai
  isRead: boolean;     // trangThai (derived)
  createdAt: string;   // den
}

// ─────────────────────────────────────────────
// CHAT - PHONG_HOI_THOAI + TIN_NHAN
// ─────────────────────────────────────────────

export interface ChatRoom {
  id: number;
  appointmentId: number;
  status: number;      // 0: closed, 1: open
}

export interface ChatMessage {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  sentAt: string;      // thoiGian (ISO datetime)
}

export interface SendMessageRequest {
  chatRoomId: number;
  content: string;
}

// ─────────────────────────────────────────────
// AI SCREENING - NHAT_KY_SANG_LOC
// ─────────────────────────────────────────────

export interface ScreeningLog {
  id: number;
  userId: number;
  specialtyId: number;
  recommendedSpecialtyId?: number;
  symptoms: string;    // trieuChung
  createdAt?: string;
}

export interface ScreeningRequest {
  symptoms: string;
}

export interface ScreeningResult {
  recommendedSpecialty: Specialty;
  confidence?: number;
  message?: string;
  relatedSpecialties?: Specialty[];
}

// ─────────────────────────────────────────────
// DOCTOR VERIFICATION - YEU_CAU_XAC_THUC
// ─────────────────────────────────────────────

export interface VerificationRequest {
  id: number;
  doctorId: number;
  adminId?: number;
  status: number;      // 0:pending, 1:approved, 2:rejected
  rejectionReason?: string;
}

// ─────────────────────────────────────────────
// PASSWORD RESET - MA_DAT_LAI_MAT_KHAU
// ─────────────────────────────────────────────

export interface PasswordResetRequest {
  phone: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ─────────────────────────────────────────────
// HEALTH DEPARTMENT - BAN_QUAN_LY_Y_TE
// ─────────────────────────────────────────────

export interface HealthDepartment {
  id: number;
  departmentName: string;
  address?: string;
}
