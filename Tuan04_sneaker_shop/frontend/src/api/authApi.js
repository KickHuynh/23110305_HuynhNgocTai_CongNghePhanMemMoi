import axiosClient from './axiosClient';
import { extractApiData } from '../utils/shop';

const TOKEN_KEYS = ['accessToken', 'token'];
const PENDING_VERIFICATION_EMAIL_KEY = 'pendingVerificationEmail';
const PENDING_RESET_EMAIL_KEY = 'pendingResetEmail';

// Đọc token hiện tại từ localStorage để duy trì phiên đăng nhập.
export const getStoredToken = () => TOKEN_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) || '';

// Lấy hồ sơ người dùng đã lưu cục bộ sau lần đăng nhập gần nhất.
export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

// Lưu token và hồ sơ người dùng sau khi đăng nhập hoặc xác thực OTP thành công.
export const setAuthSession = ({ token, user } = {}) => {
  if (token) {
    TOKEN_KEYS.forEach((key) => localStorage.setItem(key, token));
    clearPendingVerificationEmail();
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Xóa toàn bộ thông tin phiên khi người dùng đăng xuất hoặc token lỗi.
export const clearAuthSession = () => {
  TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem('user');
};

// Lưu email đang chờ xác thực để hỗ trợ luồng OTP khi chuyển trang.
export const setPendingVerificationEmail = (email) => {
  if (!email) {
    return;
  }

  localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, String(email).trim().toLowerCase());
};

export const getPendingVerificationEmail = () => localStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) || '';

export const clearPendingVerificationEmail = () => {
  localStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
};

// Lưu email đang chờ đặt lại mật khẩu để giữ luồng reset password.
export const setPendingResetEmail = (email) => {
  if (!email) {
    return;
  }

  localStorage.setItem(PENDING_RESET_EMAIL_KEY, String(email).trim().toLowerCase());
};

export const getPendingResetEmail = () => localStorage.getItem(PENDING_RESET_EMAIL_KEY) || '';

export const clearPendingResetEmail = () => {
  localStorage.removeItem(PENDING_RESET_EMAIL_KEY);
};

// Chuẩn hóa phản hồi đăng nhập hoặc xác thực OTP thành một session dùng chung.
export const extractAuthSession = (response) => {
  const payload = extractApiData(response, {});

  return {
    token: response?.data?.token || response?.data?.accessToken || payload.token || '',
    redirectUrl: response?.data?.redirectUrl || payload.redirectUrl || '',
    user: payload.user || response?.data?.user || null,
  };
};

// Xác định trang hồ sơ đích theo vai trò được backend trả về.
export const getProfileRouteByRole = (role) =>
  role === 'admin' ? '/admin/profile' : '/user/profile';

// Chỉ chấp nhận redirect nội bộ hợp lệ sau khi đăng nhập thành công.
export const resolveAuthRedirect = (redirectUrl, fallback = '/user/profile') => {
  if (typeof redirectUrl === 'string' && redirectUrl.startsWith('/')) {
    return redirectUrl;
  }

  return fallback;
};

const authApi = {
  // Gửi thông tin đăng nhập để lấy JWT và hồ sơ người dùng.
  login(credentials) {
    return axiosClient.post('/auth/login', credentials);
  },

  // Tạo tài khoản mới và kích hoạt luồng xác thực OTP qua email.
  register(payload) {
    return axiosClient.post('/auth/register', payload);
  },

  // Xác thực OTP đăng ký để kích hoạt tài khoản và nhận JWT.
  verifyRegisterOtp(payload) {
    return axiosClient.post('/auth/verify-register-otp', payload);
  },

  // Yêu cầu backend gửi lại OTP xác thực đăng ký.
  resendRegisterOtp(payload) {
    return axiosClient.post('/auth/resend-register-otp', payload);
  },

  // Lấy hồ sơ hiện tại từ API bảo vệ bằng JWT.
  getCurrentUser() {
    return axiosClient.get('/auth/me');
  },

  // Cập nhật hồ sơ cá nhân của người dùng hiện tại.
  updateProfile(payload) {
    return axiosClient.put('/auth/me', payload);
  },

  // Gửi yêu cầu nhận OTP đặt lại mật khẩu qua email.
  forgotPassword(payload) {
    return axiosClient.post('/auth/forgot-password', payload);
  },

  // Đặt lại mật khẩu mới bằng email và OTP hợp lệ.
  resetPassword(payload) {
    return axiosClient.post('/auth/reset-password', payload);
  },

  // Xóa phiên cục bộ khi người dùng chọn đăng xuất.
  logout() {
    clearAuthSession();
  },
};

export default authApi;
