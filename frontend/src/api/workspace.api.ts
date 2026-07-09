import apiClient from "./client";
import type { ApiSuccessResponse } from "../types/api.types";
import type { Avatar } from "../types/auth.types";
import type {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  Workspace,
} from "../types/workspace.types";

export const workspaceApi = {
  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    const { data } = await apiClient.post<ApiSuccessResponse<Workspace>>(
      "/workspaces",
      payload,
    );
    return data.data;
  },

  async getMine(): Promise<Workspace[]> {
    const { data } =
      await apiClient.get<ApiSuccessResponse<Workspace[]>>("/workspaces");
    return data.data;
  },

  async getById(workspaceId: string): Promise<Workspace> {
    const { data } = await apiClient.get<ApiSuccessResponse<Workspace>>(
      `/workspaces/${workspaceId}`,
    );
    return data.data;
  },

  async update(
    workspaceId: string,
    payload: UpdateWorkspacePayload,
  ): Promise<Workspace> {
    const { data } = await apiClient.patch<ApiSuccessResponse<Workspace>>(
      `/workspaces/${workspaceId}`,
      payload,
    );
    return data.data;
  },

  async remove(workspaceId: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<null>>(
      `/workspaces/${workspaceId}`,
    );
  },

  async uploadLogo(workspaceId: string, file: File): Promise<Avatar> {
    const formData = new FormData();
    formData.append("logo", file);

    const { data } = await apiClient.post<
      ApiSuccessResponse<{ logo: Avatar }>
    >(`/workspaces/${workspaceId}/logo`, formData);

    return data.data.logo;
  },
};
