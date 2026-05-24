import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, type DoctorSignupPayload } from '../../services/authService';
import { clinicService } from '../../services/clinicService';
import { specialtyService } from '../../services/specialtyService';
import { TOKEN_KEY } from '../../api/apiClient';
import type { Clinic, Specialty } from '../../types';

export const useRegisterDoctorHooks = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DoctorSignupPayload>({
    name: '',
    phone: '',
    email: '',
    password: '',
    practiceLicenseNumber: '',
    practiceStartDate: '',
    biography: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Additional states for files & relations
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [licenseImageFile, setLicenseImageFile] = useState<File | null>(null);
  const [licenseImagePreview, setLicenseImagePreview] = useState<string | null>(null);

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<number | ''>('');
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<number[]>([]);

  // States for clinic search & branching
  const [clinicSearchQuery, setClinicSearchQuery] = useState('');
  const [isClinicSearching, setIsClinicSearching] = useState(false);
  const [clinicSearchResults, setClinicSearchResults] = useState<string[]>([]);
  const [selectedClinicName, setSelectedClinicName] = useState<string>('');
  const [availableAddresses, setAvailableAddresses] = useState<Clinic[]>([]);

  const serverErrorsRef = useRef<Record<string, string>>({});

  // Fetch clinics and specialties on mount
  useEffect(() => {
    clinicService
      .getAll(0, 1000)
      .then((res) => {
        if (res?.result?.content) {
          setClinics(res.result.content);
        }
      })
      .catch((err) => console.error('Failed to load clinics', err));

    specialtyService
      .getAll(0, 1000)
      .then((res) => {
        if (res?.result?.content) {
          setSpecialties(res.result.content);
        }
      })
      .catch((err) => console.error('Failed to load specialties', err));
  }, []);

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));

      if (errors.avatar) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.avatar;
          return next;
        });
      }
    }
  };

  // Handle license image change
  const handleLicenseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseImageFile(file);
      setLicenseImagePreview(URL.createObjectURL(file));

      if (errors.practiceLicenseImage) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.practiceLicenseImage;
          return next;
        });
      }
    }
  };

  const removeAccents = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  };

  const handleSearchClinic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicSearchQuery.trim()) {
      toast.error('Vui lòng nhập tên phòng khám để tìm kiếm!');
      return;
    }

    setIsClinicSearching(true);
    // Giả lập độ trễ loading khoảng 400ms
    setTimeout(() => {
      const normalizedQuery = removeAccents(clinicSearchQuery.trim());
      // Tìm các phòng khám có tên khớp (chấp nhận một phần, không dấu)
      const matchingClinics = clinics.filter((c) =>
        removeAccents(c.clinicName).includes(normalizedQuery),
      );

      // Lấy danh sách tên phòng khám độc nhất (unique)
      const uniqueNames = Array.from(new Set(matchingClinics.map((c) => c.clinicName)));
      setClinicSearchResults(uniqueNames);
      setIsClinicSearching(false);

      if (uniqueNames.length === 0) {
        toast.info('Không tìm thấy phòng khám nào khớp với từ khóa tìm kiếm.');
      } else {
        toast.success(`Tìm thấy ${uniqueNames.length} phòng khám khớp!`);
      }
    }, 450);
  };

  const handleSelectClinicName = (name: string) => {
    setSelectedClinicName(name);

    // Tìm danh sách địa chỉ của phòng khám này
    const addresses = clinics.filter((c) => c.clinicName === name);
    setAvailableAddresses(addresses);

    // Nếu chỉ có 1 địa chỉ duy nhất, tự động chọn luôn địa chỉ đó
    if (addresses.length === 1) {
      const selectedId = addresses[0].id;
      setSelectedClinicId(selectedId);
      if (errors.clinicId) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.clinicId;
          return next;
        });
      }
    } else {
      // Nếu có nhiều địa chỉ, bắt buộc bác sĩ phải chọn địa chỉ cơ sở
      setSelectedClinicId('');
    }
    // Xóa kết quả tìm kiếm sau khi đã chọn tên phòng khám
    setClinicSearchResults([]);
  };

  const handleSelectAddress = (id: number) => {
    setSelectedClinicId(id);
    if (errors.clinicId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.clinicId;
        return next;
      });
    }
  };

  const handleClearClinicSelection = () => {
    setSelectedClinicName('');
    setAvailableAddresses([]);
    setSelectedClinicId('');
    setClinicSearchQuery('');
    setClinicSearchResults([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (serverErrorsRef.current[name]) {
      delete serverErrorsRef.current[name];
    }

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

  const toggleSpecialty = (id: number) => {
    setSelectedSpecialtyIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0 && errors.specialties) {
        setErrors((prevErr) => {
          const n = { ...prevErr };
          delete n.specialties;
          return n;
        });
      }
      return next;
    });
  };

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedClinicId(val ? Number(val) : '');
    if (val && errors.clinicId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.clinicId;
        return next;
      });
    }
  };

  const validateStep1 = (): boolean => {
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

    const step1ServerErrors: Record<string, string> = {};
    if (serverErrorsRef.current.phone) step1ServerErrors.phone = serverErrorsRef.current.phone;
    if (serverErrorsRef.current.email) step1ServerErrors.email = serverErrorsRef.current.email;

    const merged = { ...newErrors, ...step1ServerErrors };
    setErrors(merged);
    return Object.keys(merged).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.practiceLicenseNumber.trim()) {
      newErrors.practiceLicenseNumber = 'Vui lòng nhập số giấy phép hành nghề';
    }

    if (!formData.practiceStartDate) {
      newErrors.practiceStartDate = 'Vui lòng nhập ngày bắt đầu hành nghề';
    } else {
      const selectedDate = new Date(formData.practiceStartDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.practiceStartDate = 'Ngày bắt đầu hành nghề không thể ở tương lai';
      }
    }

    if (!selectedClinicId) {
      newErrors.clinicId = 'Vui lòng chọn nơi công tác (phòng khám)';
    }

    if (selectedSpecialtyIds.length === 0) {
      newErrors.specialties = 'Vui lòng chọn ít nhất một chuyên khoa';
    }

    if (!licenseImageFile) {
      newErrors.practiceLicenseImage = 'Vui lòng tải lên ảnh chụp chứng chỉ hành nghề';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Vui lòng đồng ý với điều khoản dịch vụ';
    }

    const step2ServerErrors: Record<string, string> = {};
    if (serverErrorsRef.current.practiceLicenseNumber) {
      step2ServerErrors.practiceLicenseNumber = serverErrorsRef.current.practiceLicenseNumber;
    }

    const merged = { ...newErrors, ...step2ServerErrors };
    setErrors(merged);
    return Object.keys(merged).length === 0;
  };

  const validate = (): boolean => {
    const isStep1Valid = validateStep1();
    // Validate step 2 separately to populate its errors if step 1 is valid or not
    const isStep2Valid = validateStep2();

    if (!isStep1Valid || !isStep2Valid) {
      const step1Errors: Record<string, string> = {};
      if (!formData.name.trim()) step1Errors.name = 'Vui lòng nhập họ và tên';
      else if (formData.name.trim().length < 2)
        step1Errors.name = 'Họ và tên phải có ít nhất 2 ký tự';

      if (!formData.phone.trim()) step1Errors.phone = 'Vui lòng nhập số điện thoại';
      else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.trim()))
        step1Errors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';

      if (!formData.email.trim()) step1Errors.email = 'Vui lòng nhập email';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
        step1Errors.email = 'Email không đúng định dạng';

      if (!formData.password) step1Errors.password = 'Vui lòng nhập mật khẩu';
      else if (formData.password.length < 8)
        step1Errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';

      if (!confirmPassword) step1Errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      else if (confirmPassword !== formData.password)
        step1Errors.confirmPassword = 'Mật khẩu xác nhận không khớp';

      const step2Errors: Record<string, string> = {};
      if (!formData.practiceLicenseNumber.trim())
        step2Errors.practiceLicenseNumber = 'Vui lòng nhập số giấy phép hành nghề';
      if (!formData.practiceStartDate)
        step2Errors.practiceStartDate = 'Vui lòng nhập ngày bắt đầu hành nghề';
      else {
        const selectedDate = new Date(formData.practiceStartDate);
        if (selectedDate > new Date())
          step2Errors.practiceStartDate = 'Ngày bắt đầu hành nghề không thể ở tương lai';
      }
      if (!selectedClinicId) step2Errors.clinicId = 'Vui lòng chọn nơi công tác (phòng khám)';
      if (selectedSpecialtyIds.length === 0)
        step2Errors.specialties = 'Vui lòng chọn ít nhất một chuyên khoa';
      if (!licenseImageFile)
        step2Errors.practiceLicenseImage = 'Vui lòng tải lên ảnh chụp chứng chỉ hành nghề';
      if (!agreedToTerms) step2Errors.terms = 'Vui lòng đồng ý với điều khoản dịch vụ';

      setErrors({ ...step1Errors, ...step2Errors, ...serverErrorsRef.current });
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Vui lòng điền đầy đủ và chính xác thông tin yêu cầu!');
      return;
    }

    try {
      setLoading(true);

      // Construct FormData for multipart upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('phone', formData.phone.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('password', formData.password);
      submitData.append('practiceLicenseNumber', formData.practiceLicenseNumber.trim());
      submitData.append('practiceStartDate', formData.practiceStartDate);
      if (formData.biography?.trim()) {
        submitData.append('biography', formData.biography.trim());
      }
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }
      if (licenseImageFile) {
        submitData.append('practiceLicenseImage', licenseImageFile);
      }
      if (selectedClinicId) {
        submitData.append('clinicId', selectedClinicId.toString());
      }

      // Append multiple specialties with same name
      selectedSpecialtyIds.forEach((specId) => {
        submitData.append('specialtyIds', specId.toString());
      });

      const data = await authService.signupDoctor(submitData);

      if (data?.code !== 1000) {
        throw new Error(data?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
      }

      // Check if auto-approved and logged in automatically
      if (data.result?.token && data.result?.authenticated) {
        localStorage.setItem(TOKEN_KEY, data.result.token);
        window.dispatchEvent(new Event('storage'));
        toast.success('Hồ sơ của bạn đã được phê duyệt tự động thành công! Chào mừng Bác sĩ.');
        navigate('/');
      } else {
        setSuccess(true);
        toast.success('Gửi yêu cầu đăng ký tài khoản bác sĩ thành công!');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; code?: number } } };
        const code = axiosErr.response?.data?.code;
        const backendMsg = axiosErr.response?.data?.message;

        if (code === 1017) {
          const msg = backendMsg || 'Số điện thoại này đã được sử dụng';
          serverErrorsRef.current.phone = msg;
          setErrors((prev) => ({ ...prev, phone: msg }));
          return;
        }

        if (code === 1018) {
          const msg = backendMsg || 'Email này đã được sử dụng';
          serverErrorsRef.current.email = msg;
          setErrors((prev) => ({ ...prev, email: msg }));
          return;
        }

        if (code === 1022) {
          const msg = backendMsg || 'Số giấy phép hành nghề đã được đăng ký';
          serverErrorsRef.current.practiceLicenseNumber = msg;
          setErrors((prev) => ({ ...prev, practiceLicenseNumber: msg }));
          return;
        }

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

  return {
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
    clinics,
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
    handleClinicChange,
    toggleSpecialty,
    handleTogglePassword,
    handleToggleConfirmPassword,
    handleRegister,
    validateStep1,
    validateStep2,
  };
};
