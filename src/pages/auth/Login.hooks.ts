import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, type LoginPayload } from '../../services/authService';
import { TOKEN_KEY } from '../../api/apiClient';
import { parseJwt } from '../../utils/jwt';

export type LoginView = 'login' | 'forgotPassword';

export const useLoginHooks = () => {
  const navigate = useNavigate();

  const [view, setView] = useState<LoginView>('login');
  const [formData, setFormData] = useState<LoginPayload>({
    phone: '',
    password: '',
  });
  const [forgotPhone, setForgotPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(forgotPhone.trim())) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }
    try {
      setForgotLoading(true);
      await authService.forgotPassword({ phone: forgotPhone });
      toast.success('Hướng dẫn đặt lại mật khẩu đã được gửi!');
      setView('login');
      setForgotPhone('');
    } catch {
      toast.error('Không tìm thấy tài khoản với số điện thoại này.');
    } finally {
      setForgotLoading(false);
    }
  };

  return {
    view,
    setView,
    formData,
    forgotPhone,
    setForgotPhone,
    loading,
    forgotLoading,
    errors,
    showPassword,
    handleChange,
    handleTogglePassword,
    handleLogin,
    handleGoogleLogin,
    handleForgotPassword,
  };
};
