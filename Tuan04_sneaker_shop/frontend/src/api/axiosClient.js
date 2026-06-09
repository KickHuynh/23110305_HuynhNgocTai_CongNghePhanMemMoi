import axios from 'axios';
import {
  translateMessage,
  translateValidationErrors,
} from '../utils/messages';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn access token vào header trước khi gửi các API cần xác thực.
axiosClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Dịch thông báo lỗi và validate từ backend sang nội dung dễ đọc ở frontend.
axiosClient.interceptors.response.use(
  function (response) {
    if (typeof response?.data?.message === 'string') {
      response.data.message = translateMessage(response.data.message);
    }

    if (Array.isArray(response?.data?.errors)) {
      response.data.errors = translateValidationErrors(response.data.errors);
    }

    return response;
  },
  function (error) {
    if (typeof error?.response?.data?.message === 'string') {
      error.response.data.message = translateMessage(error.response.data.message);
    }

    if (Array.isArray(error?.response?.data?.errors)) {
      error.response.data.errors = translateValidationErrors(
        error.response.data.errors
      );
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
