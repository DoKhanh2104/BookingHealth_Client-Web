import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { notificationService } from '../services/notificationService';
import { TOKEN_KEY } from '../api/apiClient';
import Logo from '../assets/logo.png';
import type { Notification } from '../types';

/* ─── Icons ─── */

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
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

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Bác sĩ', href: '/doctors' },
  { label: 'Chuyên khoa', href: '/specialties' },
  // { label: 'Phòng khám', href: '/clinics' },
  { label: 'Tư Vấn AI', href: '/screening' },
  { label: 'Về chúng tôi', href: '/about' },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Tài khoản');

  // Additional states for doctor check & notifications
  const [isDoctor, setIsDoctor] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [prevIsAuthenticated, setPrevIsAuthenticated] = useState(isAuthenticated);

  if (isAuthenticated !== prevIsAuthenticated) {
    setPrevIsAuthenticated(isAuthenticated);
    if (!isAuthenticated) {
      setAvatar(null);
      setUserName('Tài khoản');
      setIsDoctor(false);
      setNotifications([]);
      setUnreadCount(0);
    }
  }

  // Fetch user profile (avatar + name) and notifications when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Fetch profile and check role
    userService
      .getProfile()
      .then((res) => {
        if (res?.result) {
          setAvatar(res.result.avatar ?? null);
          setUserName(res.result.name ?? 'Tài khoản');
          const hasDoctorRole =
            res.result.roles?.some((role) => role.roleName === 'DOCTOR') ?? false;
          setIsDoctor(hasDoctorRole);
        }
      })
      .catch(() => {});

    // Fetch user notifications
    notificationService
      .getMyNotifications(0, 5)
      .then((res) => {
        if (res?.result?.content) {
          setNotifications(res.result.content);
        }
      })
      .catch((err) => console.error(err));

    notificationService
      .getUnreadCount()
      .then((res) => {
        if (res?.result !== undefined) {
          setUnreadCount(Number(res.result));
        }
      })
      .catch((err) => console.error(err));
  }, [isAuthenticated]);

  // Đóng user menu khi click ngoài
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userMenuOpen]);

  // Đóng menu thông báo khi click ngoài
  useEffect(() => {
    if (!notificationMenuOpen) return;
    const handler = () => setNotificationMenuOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [notificationMenuOpen]);

  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('Đã đọc tất cả thông báo');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setAvatar(null);
      logout();
    }
  };

  /** Kiểm tra link có đang active không */
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="bg-primary-foreground text-primary-foreground p-1.5 rounded-xl group-hover:bg-accent transition-colors duration-200 w-10 h-10 border border-accent">
              <img src={Logo} alt="logo" />
            </div>
            <span className="text-xl font-extrabold text-foreground tracking-tight">
              Booking<span className="text-primary">Health</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      active
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                >
                  {link.label}
                  {/* Active indicator bar */}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isDoctor && (
                  <Link
                    to="/doctor/dashboard"
                    className="px-3.5 py-2 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    ⚕ Kênh Bác sĩ
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotificationMenuOpen((prev) => {
                        const next = !prev;
                        if (next) {
                          notificationService
                            .getMyNotifications(0, 5)
                            .then((res) => {
                              if (res?.result?.content) {
                                setNotifications(res.result.content);
                              }
                            })
                            .catch((err) => console.error(err));

                          notificationService
                            .getUnreadCount()
                            .then((res) => {
                              if (res?.result !== undefined) {
                                setUnreadCount(Number(res.result));
                              }
                            })
                            .catch((err) => console.error(err));
                        }
                        return next;
                      });
                    }}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all cursor-pointer relative border border-border flex items-center justify-center w-9 h-9"
                    aria-label="Xem thông báo"
                  >
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
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-border bg-accent/20 flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">Thông báo của bạn</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                          >
                            Đọc tất cả
                          </button>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto divide-y divide-border">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3.5 space-y-1 transition-colors hover:bg-accent/40 text-left ${!notif.isRead ? 'bg-primary/5' : ''}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span
                                  className={`text-sm font-bold text-foreground leading-tight ${!notif.isRead ? 'text-primary' : ''}`}
                                >
                                  {notif.title}
                                </span>
                                {!notif.isRead && (
                                  <button
                                    onClick={(e) => handleMarkAsRead(notif.id, e)}
                                    className="text-xs text-primary hover:underline cursor-pointer flex-shrink-0"
                                  >
                                    Đã đọc
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                                {notif.content}
                              </p>
                              <span className="block text-[11px] font-medium text-muted-foreground/60 pt-1">
                                {new Date(notif.createdAt).toLocaleString('vi-VN')}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-xs text-muted-foreground leading-relaxed">
                            Không có thông báo nào.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    id="user-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen((prev) => !prev);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-accent transition-colors cursor-pointer border border-border"
                  >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={userName}
                          className="w-full h-full object-cover"
                          onError={() => setAvatar(null)}
                        />
                      ) : (
                        <UserIcon />
                      )}
                    </div>
                    <span className="max-w-[100px] truncate">{userName}</span>
                    <ChevronDownIcon />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-4 h-4 text-muted-foreground"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                        Hồ sơ của tôi
                      </Link>
                      <Link
                        to="/appointments"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-4 h-4 text-muted-foreground"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                          />
                        </svg>
                        Lịch hẹn của tôi
                      </Link>
                      <div className="border-t border-border" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
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
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                          />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/register-doctor"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 mr-2"
                >
                  Dành cho bác sĩ
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-primary hover:bg-accent rounded-xl transition-all duration-200 border border-border"
                >
                  Đăng nhập
                </Link>
                <button
                  id="header-book-btn"
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-bold text-primary-foreground bg-primary rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-sm hover:shadow-[0_4px_15px_rgba(26,113,180,0.35)] cursor-pointer"
                >
                  Đặt lịch ngay
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-btn"
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all
                  ${
                    active
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
              >
                {active && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-foreground bg-accent rounded-xl"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                    {avatar ? (
                      <img src={avatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                  {userName}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-semibold text-red-500 bg-red-50 rounded-xl cursor-pointer"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register-doctor"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-all"
                >
                  Dành cho bác sĩ
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-3 text-sm font-semibold text-primary border border-border rounded-xl hover:bg-accent transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-3 text-sm font-bold text-primary-foreground bg-primary rounded-xl hover:bg-primary-hover transition-all"
                >
                  Đặt lịch ngay
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
