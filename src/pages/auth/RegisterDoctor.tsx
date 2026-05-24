import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterDoctorHooks } from './RegisterDoctor.hooks';
import Logo from '../../assets/logo.png';

/* ─────────────── SVG Icons ─────────────── */

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

const LicenseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="w-3 h-3"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
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
        className={`w-full rounded-xl border pl-11 ${rightElement ? 'pr-12' : 'pr-4'} py-3 text-sm text-foreground bg-background outline-none transition-all duration-200 placeholder:text-muted-foreground/60
          ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/15'
          }`}
      />
      {rightElement && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
        <span>⚠</span> {error}
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
        {/* Decorative glowing blobs in background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-lg bg-background/60 backdrop-blur-xl border border-border/85 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 text-center space-y-6 animate-fadeIn">
          <div className="flex items-center justify-center">
            <div className="bg-emerald-500/10 text-emerald-500 p-5 rounded-full ring-8 ring-emerald-500/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-foreground">Đăng ký thành công!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Cảm ơn Bác sĩ đã tin tưởng và đồng hành cùng <strong>BookingHealth</strong>. Hồ sơ của
              Bác sĩ đã được hệ thống ghi nhận thành công.
            </p>
          </div>

          <div className="bg-accent/40 rounded-2xl p-5 text-left text-sm space-y-3.5 border border-border">
            <h4 className="font-bold text-foreground">Các bước tiếp theo:</h4>
            <div className="space-y-2.5 text-muted-foreground text-xs leading-relaxed">
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                  1
                </span>
                <span>
                  Ban quản trị sẽ tiến hành kiểm tra và xác thực Số giấy phép hành nghề y tế của Bác
                  sĩ.
                </span>
              </div>
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                  2
                </span>
                <span>
                  Chúng tôi có thể liên hệ với Bác sĩ qua Email hoặc Số điện thoại để hoàn tất xác
                  minh bổ sung (nếu cần).
                </span>
              </div>
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
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
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_rgba(26,113,180,0.35)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(26,113,180,0.5)] hover:bg-primary-hover active:scale-[0.98]"
            >
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Decorative glowing blobs in background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl bg-background/60 backdrop-blur-xl border border-border/80 rounded-3xl shadow-2xl p-6 sm:p-10 relative z-10">
        {/* Logo and Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-primary-foreground p-2.5 rounded-2xl shadow-md shadow-primary/20">
              <img src={Logo} alt="BookingHealth" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-2xl font-black text-foreground tracking-tight">
              BookingHealth
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20">
            ⚕ Cổng thông tin Bác sĩ
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Đăng ký làm Bác sĩ</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Tham gia mạng lưới y bác sĩ chuyên môn cao của BookingHealth.
          </p>
        </div>

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
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                      : 'bg-background border-border text-muted-foreground'
                  }`}
              >
                {step > 1 ? '✓' : '1'}
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
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
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
        <form id="register-doctor-form" onSubmit={handleRegister} noValidate className="space-y-6">
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
                {errors.avatar && <p className="text-xs text-red-500 mt-1">⚠ {errors.avatar}</p>}
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

              {/* Mật khẩu */}
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

              {/* Next Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_rgba(26,113,180,0.35)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(26,113,180,0.5)] hover:bg-primary-hover active:scale-[0.98] cursor-pointer"
                >
                  Tiếp tục bước tiếp theo
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
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
                <Field
                  id="practiceStartDate"
                  name="practiceStartDate"
                  label="Ngày bắt đầu hành nghề y"
                  type="date"
                  placeholder="Chọn ngày"
                  value={formData.practiceStartDate}
                  onChange={handleChange}
                  error={errors.practiceStartDate}
                  icon={<CalendarIcon />}
                />
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
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground bg-background outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
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
                      <div className="relative flex-grow">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.636Z"
                            />
                          </svg>
                        </span>
                        <input
                          type="text"
                          placeholder="Nhập tên phòng khám để tìm kiếm... (ví dụ: An Đức)"
                          value={clinicSearchQuery}
                          onChange={(e) => setClinicSearchQuery(e.target.value)}
                          className="w-full rounded-xl border border-border pl-9 pr-4 py-2.5 text-xs text-foreground bg-background outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSearchClinic}
                        disabled={isClinicSearching}
                        className="px-4 py-2.5 text-xs font-bold text-primary-foreground bg-primary rounded-xl hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
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
                              <span className="text-[10px] text-primary hover:underline flex-shrink-0">
                                Chọn →
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
                        <span className="text-primary text-sm">🏥</span>
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
                            className={`w-full rounded-xl border pl-4 pr-10 py-3 text-xs text-foreground bg-background outline-none transition-all duration-200 appearance-none
                              ${
                                errors.clinicId
                                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                  : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/15'
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                              />
                            </svg>
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
                    <span>⚠</span> {errors.clinicId}
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
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-all
                          ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/45 bg-background'}`}
                        >
                          {isChecked && <CheckIcon />}
                        </div>
                        <span className="truncate">{spec.specialtyName}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.specialties && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <span>⚠</span> {errors.specialties}
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
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 bg-accent/10 hover:bg-accent/20 relative flex flex-col items-center justify-center gap-2 cursor-pointer min-h-[140px]
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
                    <span>⚠</span> {errors.practiceLicenseImage}
                  </p>
                )}
              </div>

              {/* Điều khoản sử dụng */}
              <div className="space-y-1 pt-2">
                <label
                  htmlFor="terms-checkbox"
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      id="terms-checkbox"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                        ${
                          agreedToTerms
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border group-hover:border-primary/50 bg-background'
                        }`}
                    >
                      {agreedToTerms && <CheckIcon />}
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
                    <span>⚠</span> {errors.terms}
                  </p>
                )}
              </div>

              {/* Action Buttons: Back and Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full sm:w-1/3 flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-all duration-200 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5 3 12m0 0 7-7m-7 7H21"
                    />
                  </svg>
                  Quay lại
                </button>

                <button
                  id="register-doctor-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-2/3 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_rgba(26,113,180,0.35)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(26,113,180,0.5)] hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
