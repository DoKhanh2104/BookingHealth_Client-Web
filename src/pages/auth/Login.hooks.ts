import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, type LoginPayload } from '../../services/authService';
import { TOKEN_KEY } from '../../api/apiClient';
import { parseJwt } from '../../utils/jwt';
import { useGoogleLogin } from '@react-oauth/google';

export type LoginView = 'login' | 'forgotPassword' | 'tokenInput' | 'resetPassword';

export const useLoginHooks = () => {
  const navigate = useNavigate();

  const [view, setView] = useState<LoginView>('login');
  const [formData, setFormData] = useState<LoginPayload>({
    phone: '',
    password: '',
  });

  // Forgot password flow state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (
      formData.phone.trim() !== 'admin' &&
      !/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.trim())
    ) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.password?.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await authService.login(formData);

      if (data?.code !== 1000 || !data?.result?.token) {
        throw new Error('Sai số điện thoại hoặc mật khẩu');
      }

      const token = data.result.token;
      const decoded = parseJwt(token);

      if (!decoded) {
        toast.error('Không thể xác thực tài khoản!');
        return;
      }

      localStorage.setItem(TOKEN_KEY, token);
      window.dispatchEvent(new Event('storage'));

      toast.success('Đăng nhập thành công! Chào mừng bạn trở lại');
      navigate('/');
    } catch {
      toast.error('Sai số điện thoại hoặc mật khẩu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleOAuthUrl();
  };

  // Bước 1: Gửi email → backend tạo reset token (POST /auth)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Vui lòng nhập địa chỉ email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      toast.error('Địa chỉ email không hợp lệ');
      return;
    }
    try {
      setForgotLoading(true);
      await authService.forgotPassword({ email: forgotEmail });
      toast.success('Token đặt lại mật khẩu đã được tạo! Vui lòng nhập token để tiếp tục.');
      setView('tokenInput');
    } catch {
      toast.error('Không tìm thấy tài khoản với email này.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Bước 2: Xác nhận token
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim()) {
      toast.error('Vui lòng nhập token xác nhận');
      return;
    }
    setView('resetPassword');
  };

  // Bước 3: Đặt lại mật khẩu mới (POST /auth/forgot-password)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      setResetLoading(true);
      await authService.resetPassword({ token: resetToken, newPassword });
      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      // Reset toàn bộ state
      setForgotEmail('');
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      setView('login');
    } catch {
      toast.error('Token không hợp lệ hoặc đã hết hạn (10 phút). Vui lòng thử lại.');
      setView('tokenInput');
    } finally {
      setResetLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await authService.loginWithGoogle(tokenResponse.access_token);

        if (data?.code !== 1000 || !data?.result?.token) {
          toast.error('Đăng nhập Google thất bại. Vui lòng thử lại!');
          return;
        }

        const token = data.result.token;
        const decoded = parseJwt(token);

        if (!decoded) {
          toast.error('Không thể xác thực tài khoản!');
          return;
        }

        localStorage.setItem(TOKEN_KEY, token);
        window.dispatchEvent(new Event('storage'));
        toast.success('Đăng nhập Google thành công! Chào mừng bạn trở lại');
        navigate('/');
      } catch {
        toast.error('Đăng nhập Google thất bại. Vui lòng thử lại!');
      }
    },
    onError: () => toast.error('Đăng nhập Google thất bại. Vui lòng thử lại!'),
  });

  return {
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
    handleGoogleLogin,
    handleForgotPassword,
    handleTokenSubmit,
    handleResetPassword,
    loginWithGoogle,
  };
};
