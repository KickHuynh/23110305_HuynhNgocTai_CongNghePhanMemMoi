import axiosClient from './axiosClient';
import { extractApiData } from '../utils/shop';

const TOKEN_KEYS = ['accessToken', 'token'];
const PENDING_VERIFICATION_EMAIL_KEY = 'pendingVerificationEmail';
const PENDING_RESET_EMAIL_KEY = 'pendingResetEmail';

export const getStoredToken = () => TOKEN_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) || '';

export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = ({ token, user } = {}) => {
  if (token) {
    TOKEN_KEYS.forEach((key) => localStorage.setItem(key, token));
    clearPendingVerificationEmail();
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem('user');
};

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

export const extractAuthSession = (response) => {
  const payload = extractApiData(response, {});

  return {
    token: response?.data?.token || response?.data?.accessToken || payload.token || '',
    redirectUrl: response?.data?.redirectUrl || payload.redirectUrl || '',
    user: payload.user || response?.data?.user || null,
  };
};

export const getProfileRouteByRole = (role) =>
  role === 'admin' ? '/admin/profile' : '/user/profile';

export const resolveAuthRedirect = (redirectUrl, fallback = '/user/profile') => {
  if (typeof redirectUrl === 'string' && redirectUrl.startsWith('/')) {
    return redirectUrl;
  }

  return fallback;
};

const authApi = {
  login(credentials) {
    return axiosClient.post('/auth/login', credentials);
  },

  register(payload) {
    return axiosClient.post('/auth/register', payload);
  },

  verifyRegisterOtp(payload) {
    return axiosClient.post('/auth/verify-register-otp', payload);
  },

  resendRegisterOtp(payload) {
    return axiosClient.post('/auth/resend-register-otp', payload);
  },

  getCurrentUser() {
    return axiosClient.get('/auth/me');
  },

  updateProfile(payload) {
    return axiosClient.put('/auth/me', payload);
  },

  forgotPassword(payload) {
    return axiosClient.post('/auth/forgot-password', payload);
  },

  resetPassword(payload) {
    return axiosClient.post('/auth/reset-password', payload);
  },

  logout() {
    clearAuthSession();
  },
};

export default authApi;
