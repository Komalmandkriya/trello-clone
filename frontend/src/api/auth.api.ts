import apiClient from "./client";
import type { ApiSuccessResponse } from "../types/api.types";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "../types/auth.types";

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiSuccessResponse<null>>("/auth/logout");
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<ApiSuccessResponse<User>>(
      "/auth/profile",
    );
    return data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.patch<ApiSuccessResponse<User>>(
      "/auth/profile",
      payload,
    );
    return data.data;
  },
};
