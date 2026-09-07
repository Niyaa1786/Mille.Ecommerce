import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/auth';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const userInfo = ref<LoginResponse['user'] | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value);
  const isAdmin = computed(() => userInfo.value?.Role == 'Admin');

  function setTokens(access: string, refresh: string) {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  function setUser(info: LoginResponse['user']) {
    userInfo.value = info;
    localStorage.setItem('user-info', JSON.stringify(info));
  }

  function clearAuth() {
    accessToken.value = null;
    refreshToken.value = null;
    userInfo.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user-info');
  }

  function restoreSession(): void {
    const storedUser = localStorage.getItem('user-info');
    accessToken.value = localStorage.getItem('accessToken');
    refreshToken.value = localStorage.getItem('refreshToken');
    userInfo.value = storedUser ? JSON.parse(storedUser) : null;
  }

  async function login(data: LoginRequest) {
    const res = await authService.login(data);
    if (!res.data?.accessToken || !res.data.refreshToken) {
      throw new Error('Missing authentication tokens');
    }
    setTokens(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
  }

  async function logout() {
    const res = await authService.logout();
    clearAuth();
  }

  async function renewAccessToken(token: RefreshTokenRequest) {
    const res = await authService.refreshToken(token);
    if (!res.data?.accessToken || !res.data.refreshToken) {
      throw new Error('Missing authentication tokens');
    }
    setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data.accessToken;
  }

  return {
    accessToken,
    refreshToken,
    userInfo,
    isAdmin,
    isAuthenticated,
    clearAuth,
    restoreSession,
    login,
    logout,
    renewAccessToken,
  };
});
