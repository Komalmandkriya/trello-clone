import axios, { type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../utils/tokenStorage";
import type { AuthTokens } from "../types/auth.types";
import type { ApiSuccessResponse } from "../types/api.types";

const baseURL = import.meta.env.VITE_API_BASE_URL;

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function notifyRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

type AuthFailureHandler = () => void;
let authFailureHandler: AuthFailureHandler | null = null;

export function setAuthFailureHandler(handler: AuthFailureHandler) {
  authFailureHandler = handler;
}

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh-token"];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const url = originalRequest?.url ?? "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      isAuthEndpoint ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clear();
      authFailureHandler?.();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post<ApiSuccessResponse<AuthTokens>>(
        `${baseURL}/auth/refresh-token`,
        { refreshToken },
      );

      tokenStorage.setTokens(data.data);
      notifyRefreshed(data.data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.clear();
      authFailureHandler?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
