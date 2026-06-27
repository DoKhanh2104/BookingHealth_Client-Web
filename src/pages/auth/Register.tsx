import React from 'react';
import { Link } from 'react-router-dom';
import { useRegisterHooks } from './Register.hooks';
import Logo from '../../assets/logo.png';
import {
  HeartIcon,
  UserIcon,
  PhoneIcon,
  EmailIcon,
  LockIcon,
  EyeIcon,
  CheckIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
} from '../../components/icons';

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
    loginWithGoogle,
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
      <div className="hidden lg:flex lg:w-[50%] relative bg-primary overflow-hidden flex-col items-center justify-center px-12">
        <div className="relative z-10 text-center text-white space-y-8 max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <HeartIcon className="w-7 h-7" />
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
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3"
              >
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-extrabold shrink-0">
                  {item.step}
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-[50%] flex items-center justify-center px-6 py-10 bg-background overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="bg-primary p-2 rounded-lg">
              <img src={Logo} alt="BookingHealth" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-2xl font-extrabold text-foreground">BookingHealth</span>
          </div>

          <div className="space-y-6">
            <Link
              to="/"
              className=" flex justify-center items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary shadow-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Về trang chủ
            </Link>
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
              onClick={() => loginWithGoogle()}
              className="btn btn-outline btn-md btn-block"
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
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    {formData.password.length < 4 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-500" /> Quá yếu
                      </>
                    ) : formData.password.length < 6 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-yellow-500" /> Yếu
                      </>
                    ) : formData.password.length < 8 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Trung bình
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-500" /> Mạnh
                      </>
                    )}
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
                    <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-md btn-block mt-2"
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
