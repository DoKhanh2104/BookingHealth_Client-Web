import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterDoctorHooks } from './RegisterDoctor.hooks';
import Logo from '../../assets/logo.png';
import {
  UserIcon,
  PhoneIcon,
  EmailIcon,
  LockIcon,
  EyeIcon,
  CheckIcon,
  AlertTriangleIcon,
  StethoscopeIcon,
  SearchIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  BuildingIcon,
  ClockIcon,
} from '../../components/icons';
import DatePicker from '../../components/DatePicker';
import { todayYMD } from '../../utils/date';

/* ─────────────── Local-only icons (not in shared set) ─────────────── */

const EyeOffIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

const LicenseIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

/* ─────────────── Reusable Field Components ─────────────── */

interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: React.ReactNode;
  autoFocus?: boolean;
  autoComplete?: string;
  rightElement?: React.ReactNode;
}

const Field = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  autoFocus,
  autoComplete,
  rightElement,
}: FieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-semibold text-foreground">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        className={`input-field pl-11 ${rightElement ? 'pr-12' : 'pr-4'} ${
          error ? 'border-red-400 focus:border-red-500' : ''
        }`}
      />
      {rightElement && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
        <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {error}
      </p>
    )}
  </div>
);

/* ─────────────── Main Component ─────────────── */

const RegisterDoctor: React.FC = () => {
  const {
    formData,
    confirmPassword,
    loading,
    success,
    errors,
    showPassword,
    showConfirmPassword,
    agreedToTerms,
    setAgreedToTerms,
    avatarPreview,
    licenseImagePreview,
    specialties,
    selectedClinicId,
    selectedSpecialtyIds,
    clinicSearchQuery,
    setClinicSearchQuery,
    isClinicSearching,
    clinicSearchResults,
    selectedClinicName,
    availableAddresses,
    handleSearchClinic,
    handleSelectClinicName,
    handleSelectAddress,
    handleClearClinicSelection,
    handleAvatarChange,
    handleLicenseImageChange,
    handleChange,
    toggleSpecialty,
    handleTogglePassword,
    handleToggleConfirmPassword,
    handleRegister,
    validateStep1,
    isAuthenticated,
    applicationStatus,
    rejectReason,
    isResubmit,
    loadingApplication,
  } = useRegisterDoctorHooks();

  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBtn = (show: boolean, onToggle: () => void) => (
    <button
      type="button"
      onClick={onToggle}
      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      aria-label="Hiển thị/ẩn mật khẩu"
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  // Đang kiểm tra hồ sơ hiện có (khi đã đăng nhập)
  if (loadingApplication) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Hồ sơ đang chờ duyệt → chỉ hiển thị trạng thái, không cho nộp lại
  if (applicationStatus === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="card w-full max-w-md p-8 text-center space-y-4 shadow-lg">
          <div className="w-16 h-16 mx-auto bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center">
            <ClockIcon className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">Hồ sơ đang chờ duyệt</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hồ sơ đăng ký bác sĩ của bạn đã được gửi và đang chờ Ban quản trị xét duyệt. Chúng tôi
            sẽ thông báo ngay khi có kết quả.
          </p>
          <Link to="/" className="btn btn-primary btn-md btn-block">
            <ArrowLeftIcon className="w-4 h-4" /> Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Style block for animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>
        <div className="card w-full max-w-lg shadow-lg p-8 sm:p-10 relative z-10 text-center space-y-6 animate-fadeIn">
          <div className="flex items-center justify-center">
            <div className="bg-emerald-500/10 text-emerald-500 p-5 rounded-full ring-8 ring-emerald-500/5">
              <CheckIcon className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-foreground">Đăng ký thành công!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Cảm ơn Bác sĩ đã tin tưởng và đồng hành cùng <strong>BookingHealth</strong>. Hồ sơ của
              Bác sĩ đã được hệ thống ghi nhận thành công.
            </p>
          </div>

          <div className="bg-accent/40 rounded-xl p-5 text-left text-sm space-y-3.5 border border-border">
            <h4 className="font-bold text-foreground">Các bước tiếp theo:</h4>
            <div className="space-y-2.5 text-muted-foreground text-xs leading-relaxed">
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 text-[10px]">
                  1
                </span>
                <span>
                  Ban quản trị sẽ tiến hành kiểm tra và xác thực Số giấy phép hành nghề y tế của Bác
                  sĩ.
                </span>
              </div>
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 text-[10px]">
                  2
                </span>
                <span>
                  Chúng tôi có thể liên hệ với Bác sĩ qua Email hoặc Số điện thoại để hoàn tất xác
                  minh bổ sung (nếu cần).
                </span>
              </div>
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 text-[10px]">
                  3
                </span>
                <span>
                  Khi hồ sơ được kích hoạt, một thông báo qua email sẽ được gửi kèm thông tin hướng
                  dẫn truy cập hệ thống.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/" className="btn btn-primary btn-md btn-block">
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Lối quay về trang chủ (luôn hiển thị, phòng khi người dùng bấm nhầm) */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Về trang chủ
      </Link>

      {/* Style block for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      <div className="card w-full max-w-3xl shadow-lg p-6 sm:p-10 relative z-10">
        {/* Logo and Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-primary-foreground p-2.5 rounded-lg shadow-sm">
              <img src={Logo} alt="BookingHealth" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-2xl font-black text-foreground tracking-tight">
              BookingHealth
            </span>
          </div>

          <div className="badge text-primary bg-primary/10 border border-primary/20">
            <StethoscopeIcon className="w-4 h-4" /> Cổng thông tin Bác sĩ
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">
            {isResubmit ? 'Nộp lại hồ sơ Bác sĩ' : 'Đăng ký làm Bác sĩ'}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {isResubmit
              ? 'Thông tin cũ đã được điền sẵn. Vui lòng chỉnh sửa và gửi lại để được duyệt.'
              : 'Tham gia mạng lưới y bác sĩ chuyên môn cao của BookingHealth.'}
          </p>
        </div>

        {/* Banner: hồ sơ trước bị từ chối */}
        {isResubmit && (
          <div className="max-w-2xl mx-auto mb-8 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
            <AlertTriangleIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-amber-800">Hồ sơ trước đã bị từ chối</p>
              <p className="text-amber-700 mt-0.5 leading-relaxed">
                {rejectReason
                  ? `Lý do: ${rejectReason}`
                  : 'Vui lòng kiểm tra và bổ sung thông tin chính xác trước khi gửi lại.'}
              </p>
            </div>
          </div>
        )}

        {/* Stepper progress indicator */}
        <div className="max-w-md mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            {/* Background Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-muted z-0" />
            {/* Active Line Progress */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 z-0"
              style={{ width: step === 1 ? '0%' : '100%' }}
            />

            {/* Step 1 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                  ${
                    step >= 1
                      ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                      : 'bg-background border-border text-muted-foreground'
                  }`}
              >
                {step > 1 ? <CheckIcon className="w-5 h-5" /> : '1'}
              </div>
              <span
                className={`text-xs font-bold transition-all duration-300 ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Thông tin cá nhân
              </span>
            </div>

            {/* Step 2 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                  ${
                    step === 2
                      ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                      : 'bg-background border-border text-muted-foreground'
                  }`}
              >
                2
              </div>
              <span
                className={`text-xs font-bold transition-all duration-300 ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Hồ sơ chuyên môn
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form
          id="register-doctor-form"
          onSubmit={(e) => handleRegister(e, setStep)}
          noValidate
          className="space-y-6"
        >
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-sm font-bold text-foreground border-l-4 border-primary pl-2.5 mb-2">
                1. Thông tin cá nhân & Tài khoản
              </div>

              {/* Avatar Upload with Premium Preview */}
              <div className="flex flex-col items-center gap-2 pb-4">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Ảnh đại diện Bác sĩ (Tùy chọn)
                </span>

                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-border hover:border-primary transition-all duration-300 bg-accent/40 flex items-center justify-center cursor-pointer shadow-inner">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    aria-label="Tải lên ảnh đại diện"
                  />
                  {avatarPreview ? (
                    <>
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10 text-white text-[10px] font-bold">
                        Thay đổi ảnh
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-6 h-6 text-primary"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                      <span className="text-[10px] font-bold text-foreground">Tải ảnh lên</span>
                    </div>
                  )}
                </div>
                {errors.avatar && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.avatar}
                  </p>
                )}
              </div>

              {/* Họ và tên */}
              <Field
                id="name"
                name="name"
                label="Họ và tên bác sĩ"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={<UserIcon />}
                autoComplete="name"
              />

              {/* SĐT + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="phone"
                  name="phone"
                  label="Số điện thoại di động"
                  type="tel"
                  placeholder="0912 345 678"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  icon={<PhoneIcon />}
                  autoComplete="tel"
                />
                <Field
                  id="email"
                  name="email"
                  label="Địa chỉ email cá nhân"
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<EmailIcon />}
                  autoComplete="email"
                />
              </div>

              {/* Mật khẩu (Chỉ hiển thị khi chưa đăng nhập) */}
              {!isAuthenticated && (
                <>
                  <Field
                    id="password"
                    name="password"
                    label="Mật khẩu tài khoản"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 8 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={<LockIcon />}
                    autoComplete="new-password"
                    rightElement={toggleBtn(showPassword, handleTogglePassword)}
                  />

                  {/* Xác nhận mật khẩu */}
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={<LockIcon />}
                    autoComplete="new-password"
                    rightElement={toggleBtn(showConfirmPassword, handleToggleConfirmPassword)}
                  />
                </>
              )}

              {/* Next Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary btn-md btn-block"
                >
                  Tiếp tục bước tiếp theo
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-sm font-bold text-foreground border-l-4 border-primary pl-2.5 mb-2">
                2. Hồ sơ chuyên môn & Nơi công tác
              </div>

              {/* Số chứng chỉ hành nghề + Ngày bắt đầu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="practiceLicenseNumber"
                  name="practiceLicenseNumber"
                  label="Số chứng chỉ/Giấy phép hành nghề (GPHN)"
                  placeholder="12345/BYT-CCHN"
                  value={formData.practiceLicenseNumber}
                  onChange={handleChange}
                  error={errors.practiceLicenseNumber}
                  icon={<LicenseIcon />}
                />
                <div className="space-y-1.5">
                  <label
                    htmlFor="practiceStartDate"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Ngày bắt đầu hành nghề y
                  </label>
                  <DatePicker
                    id="practiceStartDate"
                    value={formData.practiceStartDate}
                    onChange={(v) =>
                      handleChange({
                        target: { name: 'practiceStartDate', value: v },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    max={todayYMD()}
                    error={!!errors.practiceStartDate}
                  />
                  {errors.practiceStartDate && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.practiceStartDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Tiểu sử ngắn */}
              <div className="space-y-1.5">
                <label htmlFor="biography" className="block text-sm font-semibold text-foreground">
                  Giới thiệu tiểu sử ngắn (Bằng cấp, kinh nghiệm công tác...)
                </label>
                <textarea
                  id="biography"
                  name="biography"
                  placeholder="Ví dụ: Bác sĩ chuyên khoa II với hơn 10 năm kinh nghiệm trong lĩnh vực Nhi khoa tại Bệnh viện Trung ương..."
                  value={formData.biography}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                />
              </div>

              {/* Nơi công tác (Phòng khám) */}
              <div className="space-y-3.5 border border-border rounded-xl p-4 bg-accent/5">
                <label className="block text-sm font-semibold text-foreground">
                  Nơi công tác (Phòng khám) <span className="text-red-500">*</span>
                </label>

                {!selectedClinicName ? (
                  // Luồng tìm kiếm phòng khám
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative grow">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <SearchIcon className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="Nhập tên phòng khám để tìm kiếm... (ví dụ: An Đức)"
                          value={clinicSearchQuery}
                          onChange={(e) => setClinicSearchQuery(e.target.value)}
                          className="input-field pl-9 pr-4 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSearchClinic}
                        disabled={isClinicSearching}
                        className="btn btn-primary btn-sm"
                      >
                        {isClinicSearching ? (
                          <>
                            <svg
                              className="animate-spin w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Tìm...
                          </>
                        ) : (
                          'Tìm kiếm'
                        )}
                      </button>
                    </div>

                    {/* Danh sách kết quả phòng khám tìm được */}
                    {clinicSearchResults.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="block text-[11px] font-semibold text-muted-foreground">
                          Chọn phòng khám từ kết quả tìm kiếm bên dưới:
                        </span>
                        <div className="border border-border rounded-xl bg-background max-h-48 overflow-y-auto divide-y divide-border shadow-inner">
                          {clinicSearchResults.map((name, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectClinicName(name)}
                              className="w-full text-left px-4 py-3 text-xs text-foreground hover:bg-accent/50 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <span className="font-semibold group-hover:text-primary transition-colors text-left">
                                {name}
                              </span>
                              <span className="text-[10px] text-primary hover:underline shrink-0 inline-flex items-center gap-1">
                                Chọn <ArrowRightIcon className="w-3 h-3" />
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Luồng hiển thị phòng khám đã chọn + chọn địa chỉ
                  <div className="space-y-3.5">
                    {/* Badge phòng khám đã chọn */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2">
                        <BuildingIcon className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-xs font-bold text-foreground">
                          {selectedClinicName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearClinicSelection}
                        className="text-[10px] font-semibold text-red-500 hover:text-red-600 hover:underline cursor-pointer"
                      >
                        Thay đổi
                      </button>
                    </div>

                    {/* Chọn địa chỉ chi nhánh */}
                    {availableAddresses.length > 1 ? (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="addressSelect"
                          className="block text-xs font-semibold text-muted-foreground"
                        >
                          Chọn địa chỉ/cơ sở công tác <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="addressSelect"
                            value={selectedClinicId}
                            onChange={(e) => handleSelectAddress(Number(e.target.value))}
                            className={`input-field pl-4 pr-10 text-xs appearance-none ${
                              errors.clinicId ? 'border-red-400 focus:border-red-500' : ''
                            }`}
                          >
                            <option value="">-- Chọn chi nhánh công tác --</option>
                            {availableAddresses.map((clinic) => (
                              <option key={clinic.id} value={clinic.id}>
                                {clinic.address}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <ChevronDownIcon className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Nếu chỉ có 1 địa chỉ, hiển thị cố định và tự động chọn
                      availableAddresses.length === 1 && (
                        <div className="p-3.5 rounded-xl border border-dashed border-border bg-background text-xs text-left space-y-1">
                          <span className="block text-[10px] font-semibold text-muted-foreground">
                            Địa chỉ cơ sở (Tự động chọn):
                          </span>
                          <p className="font-semibold text-foreground leading-relaxed">
                            {availableAddresses[0].address}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

                {errors.clinicId && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.clinicId}
                  </p>
                )}
              </div>

              {/* Chuyên khoa */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Chuyên khoa y tế đăng ký <span className="text-red-500">*</span>
                </label>
                <div
                  className={`grid grid-cols-2 gap-2.5 rounded-xl border p-4 bg-accent/5 max-h-48 overflow-y-auto
                  ${errors.specialties ? 'border-red-400' : 'border-border'}`}
                >
                  {specialties.map((spec) => {
                    const isChecked = selectedSpecialtyIds.includes(spec.id);
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => toggleSpecialty(spec.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-all duration-200 border cursor-pointer
                          ${
                            isChecked
                              ? 'bg-primary/10 border-primary text-primary font-semibold'
                              : 'bg-background border-border text-muted-foreground hover:border-primary/30 hover:bg-accent/40'
                          }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all
                          ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/45 bg-background'}`}
                        >
                          {isChecked && <CheckIcon className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{spec.specialtyName}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.specialties && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.specialties}
                  </p>
                )}
              </div>

              {/* Ảnh chụp chứng chỉ */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-foreground">
                  Ảnh chụp Giấy phép/Chứng chỉ hành nghề y tế (GPHN){' '}
                  <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 bg-accent/10 hover:bg-accent/20 relative flex flex-col items-center justify-center gap-2 cursor-pointer min-h-35
                  ${errors.practiceLicenseImage ? 'border-red-400 hover:border-red-500' : 'border-border hover:border-primary'}`}
                >
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleLicenseImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    aria-label="Tải lên ảnh chụp chứng chỉ"
                  />
                  {licenseImagePreview ? (
                    <div className="w-full max-h-36 overflow-hidden rounded-lg relative flex flex-col items-center">
                      <img
                        src={licenseImagePreview}
                        alt="License Preview"
                        className="max-h-28 object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white text-xs font-bold rounded-lg">
                        Thay đổi chứng chỉ
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center gap-1.5 py-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-8 h-8 text-primary"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                        />
                      </svg>
                      <span className="text-xs font-bold text-foreground">
                        Chọn hoặc kéo thả ảnh chứng chỉ vào đây
                      </span>
                      <span className="text-[10px]">Chấp nhận file ảnh (JPG, PNG) tối đa 5MB</span>
                    </div>
                  )}
                </div>
                {errors.practiceLicenseImage && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.practiceLicenseImage}
                  </p>
                )}
              </div>

              {/* Điều khoản sử dụng */}
              <div className="space-y-1 pt-2">
                <label
                  htmlFor="terms-checkbox"
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      id="terms-checkbox"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                        ${
                          agreedToTerms
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border group-hover:border-primary/50 bg-background'
                        }`}
                    >
                      {agreedToTerms && <CheckIcon className="w-3 h-3" />}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Tôi cam kết các thông tin y tế trên là đúng sự thật và đồng ý tuân thủ{' '}
                    <Link
                      to="/terms"
                      className="font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                      Điều khoản dịch vụ
                    </Link>{' '}
                    dành cho đối tác y tế của BookingHealth.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-500 flex items-center gap-1 pl-8">
                    <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.terms}
                  </p>
                )}
              </div>

              {/* Action Buttons: Back and Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn btn-outline btn-md w-full sm:w-1/3"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Quay lại
                </button>

                <button
                  id="register-doctor-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-md w-full sm:w-2/3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Đang gửi yêu cầu...
                    </>
                  ) : (
                    'Gửi yêu cầu đăng ký hồ sơ'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-muted-foreground pt-6 mt-6 border-t border-border/50">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterDoctor;
