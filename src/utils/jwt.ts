/**
 * Giải mã JWT Token lấy phần Payload chứa thông tin User và Role
 * (Hàm cơ bản không cần sử dụng thư viện ngoài)
 *
 * @param token Chuỗi JWT
 * @returns Object JSON chứa dữ liệu hoặc null nếu lỗi
 */
export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.log('Error parsing JWT:', error);
    return null;
  }
};
