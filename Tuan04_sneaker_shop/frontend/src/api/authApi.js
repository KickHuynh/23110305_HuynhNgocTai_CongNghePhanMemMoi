import axiosClient from './axiosClient';
import { extractApiData } from '../utils/shop';

const TOKEN_KEYS = ['accessToken', 'token'];

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
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem('user');
};

export const extractAuthSession = (response) => {
  const payload = extractApiData(response, {});

  return {
    token: response?.data?.token || response?.data?.accessToken || payload.token || '',
    user: payload.user || response?.data?.user || null,
  };
};

const authApi = {
  login(credentials) {
    return axiosClient.post('/auth/login', credentials);
  },

  register(payload) {
    return axiosClient.post('/auth/register', payload);
  },

  getCurrentUser() {
    return axiosClient.get('/auth/me');
  },

  logout() {
    clearAuthSession();
  },
};

export default authApi;
