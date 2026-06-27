import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { userService, type UpdateProfileRequest } from '../../services/userService';
import type { User } from '../../types';
import { UserIcon, PencilIcon, CheckIcon } from '../../components/icons';

/* ─── SVG Icons cục bộ ─── */
const CameraIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
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
      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
    />
  </svg>
);

/* ─── Spinner ─── */
const Spinner = () => (
  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

/* ─── Input Field Component ─── */
interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  rightSlot?: React.ReactNode;
  hint?: string;
}
const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  rightSlot,
  hint,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-semibold text-foreground">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`input-field ${rightSlot ? 'pr-12' : ''} ${
          disabled ? 'bg-accent/40 text-muted-foreground cursor-not-allowed' : ''
        }`}
      />
      {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

/* ─── Main Profile Page ─── */
const Profile: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profile, setProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    userService
      .getProfile()
      .then((res) => {
        if (res?.result) {
          setProfile(res.result);
          setName(res.result.name ?? '');
          setEmail(res.result.email ?? '');
          setPhone(res.result.phone ?? '');
          setAvatarPreview(res.result.avatar ?? null);
        }
      })
      .catch(() => toast.error('Không thể tải thông tin hồ sơ.'))
      .finally(() => setLoadingProfile(false));
  }, []);

  /* ── Avatar upload ── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    try {
      setUploadingAvatar(true);
      const res = await userService.uploadAvatar(file);
      if (res?.result?.avatarUrl) {
        setAvatarPreview(res.result.avatarUrl);
        toast.success('Ảnh đại diện đã được cập nhật!');
        // Trigger storage event to refresh header avatar
        window.dispatchEvent(new Event('storage'));
      }
    } catch {
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  /* ── Save profile info ── */
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Tên không được để trống');
      return;
    }

    const payload: UpdateProfileRequest = {};
    if (name !== profile?.name) payload.name = name.trim();

    // Chỉ cho phép gửi phone lên nếu trước đó tài khoản chưa có số điện thoại
    if (!profile?.phone && phone.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone.trim())) {
        toast.error('Số điện thoại không hợp lệ (phải gồm 10 chữ số)');
        return;
      }
      payload.phone = phone.trim();
    }

    if (Object.keys(payload).length === 0) {
      toast.info('Không có thay đổi nào để lưu.');
      return;
    }

    try {
      setSavingInfo(true);
      const res = await userService.updateProfile(payload);
      if (res?.result) {
        setProfile(res.result);
        setName(res.result.name ?? '');
        setEmail(res.result.email ?? '');
        setPhone(res.result.phone ?? '');
        toast.success('Thông tin hồ sơ đã được cập nhật!');
        window.dispatchEvent(new Event('storage'));
      }
    } catch {
      toast.error('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setSavingInfo(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loadingProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Spinner />
          </div>
          <p className="text-sm text-muted-foreground">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  /* ─── Render ─── */
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Hồ sơ của tôi</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Quản lý thông tin cá nhân và bảo mật tài khoản
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* ── Left: Avatar card ── */}
        <div className="space-y-5">
          {/* Avatar */}
          <div className="card p-6 flex flex-col items-center gap-4 shadow-sm">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20 bg-primary/10 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarPreview(null)}
                  />
                ) : (
                  <UserIcon className="w-14 h-14 text-primary" />
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <Spinner />
                  </div>
                )}
              </div>

              {/* Camera overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60"
                title="Thay ảnh đại diện"
              >
                <CameraIcon className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="text-center">
              <p className="font-bold text-lg text-foreground">{profile?.name ?? '—'}</p>
              <p className="text-sm text-muted-foreground">
                {profile?.email ?? profile?.phone ?? '—'}
              </p>
              <span className="badge mt-2 bg-emerald-50 text-emerald-600">
                <CheckIcon className="w-4 h-4" /> Tài khoản hoạt động
              </span>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="btn btn-outline btn-md btn-block text-primary border-primary/30 hover:bg-primary/5"
            >
              <CameraIcon className="w-5 h-5" />
              {uploadingAvatar ? 'Đang tải...' : 'Thay ảnh đại diện'}
            </button>
          </div>

          {/* Account info summary */}
          <div className="card p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground">Thông tin tài khoản</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại</span>
                <span className="font-medium text-foreground">{profile?.phone ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái</span>
                <span className="text-emerald-600 font-semibold">Hoạt động</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Personal Info Form ── */}
        <div className="card shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="border-b border-border px-6 py-4 bg-accent/10">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <PencilIcon className="w-4 h-4" /> Thông tin cá nhân
            </h2>
          </div>

          <form onSubmit={handleSaveInfo} className="p-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField
                id="profile-name"
                label="Họ và tên"
                value={name}
                onChange={setName}
                placeholder="Nguyễn Văn A"
              />
              <InputField
                id="profile-phone"
                label="Số điện thoại"
                value={phone}
                onChange={setPhone}
                disabled={!!profile?.phone}
                hint={
                  profile?.phone
                    ? 'Số điện thoại không thể thay đổi'
                    : 'Vui lòng cập nhật số điện thoại để đặt lịch khám'
                }
              />
            </div>

            <InputField
              id="profile-email"
              label="Địa chỉ email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="example@email.com"
              disabled
              hint="Địa chỉ email không thể thay đổi"
            />

            <div className="flex justify-end pt-2">
              <button
                id="save-info-btn"
                type="submit"
                disabled={savingInfo}
                className="btn btn-primary btn-lg"
              >
                {savingInfo ? (
                  <>
                    <Spinner /> Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" /> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
