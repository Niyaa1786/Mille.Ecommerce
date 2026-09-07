import type { ApiResponse } from '@/shared/types/api';
import {
  type ChangePassworRequest,
  type LoginRequest,
  type LoginResponse,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type RegisterRequest,
  type RegisterResponse,
} from '../types/auth';
import apiClient from '@/shared/services/axios';

const BASE_URL = '/api/Auth';

export const authService = {
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const res = await apiClient.post<ApiResponse<LoginResponse>>(`${BASE_URL}/login`, data);
    return res.data;
  },

  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>(`${BASE_URL}/register`, data);
    return res.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>(`${BASE_URL}/logout`);
    return res.data;
  },

  async changePassword(data: ChangePassworRequest): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>(`${BASE_URL}/change-password`, data);
    return res.data;
  },

  async refreshToken(
    refreshToken: RefreshTokenRequest,
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    const res = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      `${BASE_URL}/refresh-token`,
      refreshToken,
    );
    return res.data;
  },
};
