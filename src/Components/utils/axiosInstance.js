// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7001/api', // <-- API base
  timeout: 100000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;