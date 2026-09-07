import { useAuthStore } from '@/modules/auth/stores/authStore';
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  return config;
});
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const authStore = useAuthStore();

    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = authStore.refreshToken;
        if (!refreshToken) throw new Error('No refresh token');

        const newAccessToken = await authStore.renewAccessToken({ refreshToken });
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (error) {
        authStore.clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
