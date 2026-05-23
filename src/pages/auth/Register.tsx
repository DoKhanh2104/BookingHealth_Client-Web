import React from 'react';
import { Link } from 'react-router-dom';
import { useRegisterHooks } from './Register.hooks';
import Logo from '../../assets/logo.png';

/* ─────────────── SVG Icons ─────────────── */

const HeartIcon = () => (
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
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

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

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
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

/* ─────────────── Reusable Field Component ─────────────── */

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

const Register: React.FC = () => {
  const {
    formData,
    confirmPassword,
    loading,
    errors,
    showPassword,
    showConfirmPassword,
    agreedToTerms,
    setAgreedToTerms,
    handleChange,
    handleTogglePassword,
    handleToggleConfirmPassword,
    handleRegister,
    handleGoogleRegister,
  } = useRegisterHooks();

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

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-primary via-primary-hover to-secondary overflow-hidden flex-col items-center justify-center px-12">
        {/* Blobs */}

        <div className="absolute top-1/4 right-8 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />

        <div className="relative z-10 text-center text-white space-y-8 max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-2xl">
              <HeartIcon />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">BookingHealth</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-4xl font-black leading-tight">
              Tham gia cùng
              <br />
              <span className="text-white/80">hàng nghìn</span>
              <br />
              bệnh nhân.
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Đăng ký miễn phí và bắt đầu hành trình chăm sóc sức khoẻ thông minh của bạn ngay hôm
              nay.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-3 text-sm text-left">
            {[
              { step: '01', text: 'Tạo tài khoản chỉ trong 1 phút' },
              { step: '02', text: 'Tìm bác sĩ phù hợp với nhu cầu' },
              { step: '03', text: 'Đặt lịch và nhận xác nhận ngay' },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
              >
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                  {item.step}
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          {/* <div className="flex items-center justify-center gap-6 text-white/60 text-xs">
            <span className="flex items-center gap-1.5">🔒 Bảo mật SSL</span>
            <span className="flex items-center gap-1.5">✅ Hoàn toàn miễn phí</span>
          </div> */}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-[55%] flex items-center justify-center px-6 py-10 bg-background overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="bg-primary p-2 rounded-xl">
              <img src={Logo} alt="BookingHealth" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-2xl font-extrabold text-foreground">BookingHealth</span>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">Tạo tài khoản</h1>
              <p className="mt-1.5 text-muted-foreground text-sm">
                Đăng ký miễn phí — chỉ mất dưới 1 phút!
              </p>
            </div>

            {/* Google OAuth */}
            <button
              id="google-register-btn"
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:border-primary/30 hover:shadow-md active:scale-[0.98] cursor-pointer"
            >
              <GoogleIcon />
              Tiếp tục với Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">
                hoặc đăng ký bằng thông tin
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Form */}
            <form id="register-form" onSubmit={handleRegister} noValidate className="space-y-4">
              {/* Row: Full name */}
              <Field
                id="name"
                name="name"
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={<UserIcon />}
                autoFocus
                autoComplete="name"
              />

              {/* Row: Phone + Email (2 cols on md+) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="phone"
                  name="phone"
                  label="Số điện thoại"
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
                  label="Email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<EmailIcon />}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <Field
                id="password"
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tối thiểu 8 ký tự"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<LockIcon />}
                autoComplete="new-password"
                rightElement={toggleBtn(showPassword, handleTogglePassword)}
              />

              {/* Password strength indicator */}
              {formData.password.length > 0 && (
                <div className="space-y-1.5 -mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strength = Math.min(Math.floor(formData.password.length / 2), 4);
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= strength
                              ? strength <= 1
                                ? 'bg-red-400'
                                : strength <= 2
                                  ? 'bg-amber-400'
                                  : strength <= 3
                                    ? 'bg-blue-400'
                                    : 'bg-green-500'
                              : 'bg-border'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.password.length < 4
                      ? '🔴 Quá yếu'
                      : formData.password.length < 6
                        ? '🟡 Yếu'
                        : formData.password.length < 8
                          ? '🔵 Trung bình'
                          : '🟢 Mạnh'}
                  </p>
                </div>
              )}

              {/* Confirm password */}
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

              {/* Terms checkbox */}
              <div className="space-y-1">
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
                    Tôi đồng ý với{' '}
                    <Link
                      to="/terms"
                      className="font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                      Điều khoản dịch vụ
                    </Link>{' '}
                    và{' '}
                    <Link
                      to="/privacy"
                      className="font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                      Chính sách bảo mật
                    </Link>{' '}
                    của BookingHealth.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-500 flex items-center gap-1 pl-8">
                    <span>⚠</span> {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_8px_20px_rgba(26,113,180,0.35)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(26,113,180,0.5)] hover:bg-primary-hover active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_20px_rgba(26,113,180,0.35)] cursor-pointer mt-2"
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
                    Đang tạo tài khoản...
                  </>
                ) : (
                  'Tạo tài khoản'
                )}
              </button>
            </form>

            {/* Login redirect */}
            <p className="text-center text-sm text-muted-foreground">
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
      </div>
    </div>
  );
};

export default Register;
