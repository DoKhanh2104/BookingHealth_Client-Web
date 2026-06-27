import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginHooks } from './Login.hooks';
import {
  PhoneIcon,
  LockIcon,
  EyeIcon,
  EmailIcon,
  KeyIcon,
  ArrowLeftIcon,
  HeartIcon,
  BuildingIcon,
  CalendarIcon,
  AlertTriangleIcon,
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

/* ─────────────────────────────────────────────────────────────────── */

const Login: React.FC = () => {
  const {
    view,
    setView,
    formData,
    forgotEmail,
    setForgotEmail,
    resetToken,
    setResetToken,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    forgotLoading,
    resetLoading,
    errors,
    showPassword,
    handleChange,
    handleTogglePassword,
    handleLogin,
    handleForgotPassword,
    handleTokenSubmit,
    handleResetPassword,
    loginWithGoogle,
  } = useLoginHooks();

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (decorative) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden flex-col items-center justify-center px-12">
        <div className="relative z-10 text-center text-white space-y-8 max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <HeartIcon className="w-7 h-7" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">BookingHealth</span>
          </div>

          {/* Tagline */}
          <div className="space-y-3">
            <h2 className="text-4xl font-black leading-tight">
              Chăm sóc sức khoẻ
              <br />
              <span className="text-white/80">của bạn,</span>
              <br />
              mọi lúc mọi nơi.
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Đặt lịch khám, theo dõi sức khoẻ và kết nối với bác sĩ chuyên nghiệp — tất cả trong
              một ứng dụng.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 text-sm">
            {[
              {
                icon: <BuildingIcon className="w-5 h-5 shrink-0" />,
                text: 'Hàng nghìn bác sĩ chuyên khoa',
              },
              {
                icon: <CalendarIcon className="w-5 h-5 shrink-0" />,
                text: 'Đặt lịch nhanh chóng, dễ dàng',
              },
              {
                icon: <LockIcon className="w-5 h-5 shrink-0" />,
                text: 'Bảo mật thông tin tuyệt đối',
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5"
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <HeartIcon className="w-7 h-7" />
            </div>
            <span className="text-2xl font-extrabold text-foreground">BookingHealth</span>
          </div>

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div className="space-y-7 animate-in fade-in duration-300">
              <Link
                to="/"
                className=" flex justify-center items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary shadow-sm"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Về trang chủ
              </Link>
              <div>
                <h1 className="text-3xl font-extrabold text-foreground">Đăng nhập</h1>
                <p className="mt-1.5 text-muted-foreground text-sm">
                  Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
                </p>
              </div>

              {/* Google OAuth */}
              <button
                id="google-login-btn"
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
                  hoặc đăng nhập bằng SĐT
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} noValidate className="space-y-5">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <PhoneIcon />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      autoFocus
                      placeholder="0912 345 678"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`input-field pl-11 pr-4 ${errors.phone ? 'border-red-400 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      id="forgot-password-link"
                      onClick={() => setView('forgotPassword')}
                      className="text-xs font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <LockIcon />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`input-field pl-11 pr-12 ${errors.password ? 'border-red-400 focus:border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={handleTogglePassword}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Hiển thị/ẩn mật khẩu"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertTriangleIcon className="w-4 h-4 shrink-0" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-md btn-block"
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
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </form>

              {/* Register hint */}
              <p className="text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{' '}
                <a
                  href="/register"
                  className="font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>
          )}

          {/* ════════ FORGOT PASSWORD VIEW ════════ */}
          {view === 'forgotPassword' && (
            <div className="space-y-7 animate-in fade-in duration-300">
              {/* Back */}
              <button
                type="button"
                id="back-to-login-btn"
                onClick={() => setView('login')}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Quay lại đăng nhập
              </button>

              <div>
                <h1 className="text-3xl font-extrabold text-foreground">Quên mật khẩu</h1>
                <p className="mt-1.5 text-muted-foreground text-sm">
                  Nhập địa chỉ email đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho
                  bạn.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} noValidate className="space-y-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Địa chỉ email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <EmailIcon />
                    </span>
                    <input
                      id="forgot-email"
                      name="forgot-email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      placeholder="example@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="input-field pl-11 pr-4"
                    />
                  </div>
                </div>

                <button
                  id="forgot-password-submit-btn"
                  type="submit"
                  disabled={forgotLoading}
                  className="btn btn-primary btn-md btn-block"
                >
                  {forgotLoading ? (
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
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi hướng dẫn'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ════════ TOKEN INPUT VIEW ════════ */}
          {view === 'tokenInput' && (
            <div className="space-y-7 animate-in fade-in duration-300">
              {/* Back */}
              <button
                type="button"
                id="back-to-forgot-btn"
                onClick={() => setView('forgotPassword')}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Quay lại
              </button>

              <div>
                <h1 className="text-3xl font-extrabold text-foreground">Nhập mã xác nhận</h1>
                <p className="mt-1.5 text-muted-foreground text-sm">
                  Mã token đã được tạo. Vui lòng kiểm tra email{' '}
                  <span className="font-semibold text-primary">{forgotEmail}</span> hoặc hỏi quản
                  trị viên để lấy token.
                </p>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-xl p-4">
                <KeyIcon className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Token có hiệu lực trong 10 phút</p>
                  <p className="text-muted-foreground mt-0.5">
                    Dán token từ email vào ô bên dưới để tiếp tục đặt lại mật khẩu.
                  </p>
                </div>
              </div>

              <form onSubmit={handleTokenSubmit} noValidate className="space-y-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-token"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Token xác nhận
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <KeyIcon />
                    </span>
                    <input
                      id="reset-token"
                      name="reset-token"
                      type="text"
                      autoFocus
                      placeholder="Dán token vào đây..."
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="input-field pl-11 pr-4 font-mono"
                    />
                  </div>
                </div>

                <button
                  id="token-submit-btn"
                  type="submit"
                  className="btn btn-primary btn-md btn-block"
                >
                  Tiếp tục
                </button>
              </form>
            </div>
          )}

          {/* ════════ RESET PASSWORD VIEW ════════ */}
          {view === 'resetPassword' && (
            <div className="space-y-7 animate-in fade-in duration-300">
              {/* Back */}
              <button
                type="button"
                id="back-to-token-btn"
                onClick={() => setView('tokenInput')}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Quay lại
              </button>

              <div>
                <h1 className="text-3xl font-extrabold text-foreground">Đặt mật khẩu mới</h1>
                <p className="mt-1.5 text-muted-foreground text-sm">
                  Tạo mật khẩu mới an toàn cho tài khoản của bạn.
                </p>
              </div>

              <form onSubmit={handleResetPassword} noValidate className="space-y-5">
                {/* New password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <LockIcon />
                    </span>
                    <input
                      id="new-password"
                      name="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      autoFocus
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field pl-11 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Hiển thị/ẩn mật khẩu mới"
                    >
                      {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Ít nhất 6 ký tự</p>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <LockIcon />
                    </span>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`input-field pl-11 pr-12 ${
                        confirmPassword && newPassword !== confirmPassword
                          ? 'border-red-400 focus:border-red-500'
                          : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Hiển thị/ẩn xác nhận mật khẩu"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangleIcon className="w-4 h-4 shrink-0" /> Mật khẩu xác nhận không
                      khớp
                    </p>
                  )}
                </div>

                <button
                  id="reset-password-submit-btn"
                  type="submit"
                  disabled={resetLoading}
                  className="btn btn-primary btn-md btn-block"
                >
                  {resetLoading ? (
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
                      Đang lưu...
                    </>
                  ) : (
                    'Đặt lại mật khẩu'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
