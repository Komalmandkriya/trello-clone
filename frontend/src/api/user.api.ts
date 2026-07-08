import apiClient from "./client";
import type { ApiSuccessResponse } from "../types/api.types";
import type { Avatar } from "../types/auth.types";

export const userApi = {
  async uploadAvatar(file: File): Promise<Avatar> {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await apiClient.post<
      ApiSuccessResponse<{ avatar: Avatar }>
    >("/users/avatar", formData);

    return data.data.avatar;
  },
};
