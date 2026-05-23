import { useState, useEffect, type ReactNode } from 'react';
import { TOKEN_KEY } from '../api/apiClient';
import { parseJwt } from '../utils/jwt';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        const decoded = parseJwt(token);
        // Kiểm tra token có hợp lệ và chưa hết hạn không (exp là giây)
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          // Gán role dựa vào scope trả về từ token của bạn (ví dụ: "ROLE_ADMIN")
          setRole(decoded.scope || null);
        } else {
          // Token hết hạn
          localStorage.removeItem(TOKEN_KEY);
          setIsAuthenticated(false);
          setRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }
      setLoading(false);
    };

    checkAuth();

    // Lắng nghe sự thay đổi storage từ các tab khác
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
