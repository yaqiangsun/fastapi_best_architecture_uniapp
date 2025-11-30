import Request from 'luch-request';
import { useAccessStore } from '@/store/access';
// import { useAuthStore } from '@/store/auth'; // Avoid circular dependency if auth store uses request
// We can use pinia store inside interceptors safely.

const http = new Request();

// Base URL
// You should configure VITE_API_URL in .env
http.config.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Request interceptor
http.interceptors.request.use((config) => {
  const accessStore = useAccessStore();
  config.header = {
    ...config.header,
    'Accept-Language': 'zh-CN',
  };
  if (accessStore.accessToken) {
    config.header['Authorization'] = `Bearer ${accessStore.accessToken}`;
  }
  return config;
});

// Response interceptor
http.interceptors.response.use(
  (response) => {
    // The original code expects the data field directly if configured, 
    // but usually we want the whole response data (which includes code, msg, data).
    // However, the original `requestClient` seems to return `T` which is the data payload.
    // Let's check `auth.ts`: `requestClient.get<CaptchaResult>`.
    // If the backend returns { code: 0, data: { ... }, msg: "ok" }, then T is { ... }.
    // So we should return response.data.data if success, or handle error.

    const res = response.data;
    // Adjust this based on your actual backend response structure
    // If backend returns standard { code, data, msg }
    if (res.code !== undefined && res.code !== 200 && res.code !== 0) {
      uni.showToast({
        title: res.msg || res.message || 'Error',
        icon: 'none'
      });
      return Promise.reject(res);
    }

    // If the return type T is the data inside 'data' field:
    return res.data !== undefined ? res.data : res;
  },
  (error) => {
    const accessStore = useAccessStore();

    if (error.statusCode === 401) {
      accessStore.setAccessToken(null);
      uni.reLaunch({ url: '/pages/login/index' }); // Adjust login path
    }

    uni.showToast({
      title: error.data?.msg || error.errMsg || 'Request failed',
      icon: 'none',
    });
    return Promise.reject(error);
  }
);

export const requestClient = {
  get: <T>(url: string, params?: any) => http.get<T>(url, { params }).then(res => res.data as T),
  post: <T>(url: string, data?: any) => http.post<T>(url, data).then(res => res.data as T),
  put: <T>(url: string, data?: any) => http.put<T>(url, data).then(res => res.data as T),
  delete: <T>(url: string, params?: any) => http.delete<T>(url, { params }).then(res => res.data as T),
};

export const miniRequestClient = requestClient;
export const baseRequestClient = requestClient;
