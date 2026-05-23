import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, type SignupPayload } from '../../services/authService';
import { TOKEN_KEY } from '../../api/apiClient';

export const useRegisterHooks = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupPayload>({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  /**
   * Lưu lỗi do server trả về theo từng field.
   * Dùng useRef để tránh re-render và để validate() có thể đọc giá trị mới nhất.
   * Khi user thay đổi nội dung field → xoá server error của field đó.
   */
  const serverErrorsRef = useRef<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Nếu field này đang có server error → xoá đi vì user đã sửa
    if (serverErrorsRef.current[name]) {
      delete serverErrorsRef.current[name];
    }

    // Xoá lỗi UI khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Vui lòng đồng ý với điều khoản dịch vụ';
    }

    /**
     * Merge server errors vào: nếu field vẫn chưa được user chỉnh sửa (server error còn trong ref)
     * thì giữ lại lỗi đó → validate() trả về false → không gọi API → không nhấp nháy.
     */
    const merged = { ...newErrors, ...serverErrorsRef.current };

    setErrors(merged);
    return Object.keys(merged).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await authService.signup(formData);

      if (data?.code !== 1000 || !data?.result?.token) {
        throw new Error(data?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
      }

      // Lưu token và đăng nhập thẳng vào hệ thống
      localStorage.setItem(TOKEN_KEY, data.result.token);
      window.dispatchEvent(new Event('storage'));

      toast.success('Đăng ký thành công! Chào mừng bạn đến với BookingHealth');
      navigate('/');
    } catch (err: unknown) {
      // Axios trả về 4xx/5xx sẽ throw AxiosError — cần lấy message từ response body
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; code?: number } } };
        const code = axiosErr.response?.data?.code;
        const backendMsg = axiosErr.response?.data?.message;

        // Trùng số điện thoại → lưu vào ref + set lỗi inline
        if (code === 1017) {
          const msg = backendMsg || 'Số điện thoại này đã được sử dụng';
          serverErrorsRef.current.phone = msg;
          setErrors((prev) => ({ ...prev, phone: msg }));
          return;
        }

        // Trùng email → lưu vào ref + set lỗi inline
        if (code === 1018) {
          const msg = backendMsg || 'Email này đã được sử dụng';
          serverErrorsRef.current.email = msg;
          setErrors((prev) => ({ ...prev, email: msg }));
          return;
        }

        // Lỗi khác từ backend → toast
        toast.error(backendMsg || 'Đăng ký thất bại. Vui lòng thử lại!');
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = authService.getGoogleOAuthUrl();
  };

  return {
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
  };
};
