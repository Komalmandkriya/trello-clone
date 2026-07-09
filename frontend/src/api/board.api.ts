import apiClient from "./client";
import type { ApiSuccessResponse } from "../types/api.types";
import type {
  Board,
  CreateBoardPayload,
  UpdateBoardPayload,
} from "../types/board.types";

export const boardApi = {
  async create(payload: CreateBoardPayload): Promise<Board> {
    const { data } = await apiClient.post<ApiSuccessResponse<Board>>(
      "/boards",
      payload,
    );
    return data.data;
  },

  async getByWorkspace(workspaceId: string): Promise<Board[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<Board[]>>(
      `/boards/workspace/${workspaceId}`,
    );
    return data.data;
  },

  async getById(boardId: string): Promise<Board> {
    const { data } = await apiClient.get<ApiSuccessResponse<Board>>(
      `/boards/${boardId}`,
    );
    return data.data;
  },

  async update(boardId: string, payload: UpdateBoardPayload): Promise<Board> {
    const { data } = await apiClient.patch<ApiSuccessResponse<Board>>(
      `/boards/${boardId}`,
      payload,
    );
    return data.data;
  },

  async archive(boardId: string): Promise<Board> {
    const { data } = await apiClient.patch<ApiSuccessResponse<Board>>(
      `/boards/${boardId}/archive`,
    );
    return data.data;
  },

  async remove(boardId: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<null>>(`/boards/${boardId}`);
  },

  async uploadBackground(
    boardId: string,
    file: File,
  ): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append("background", file);

    const { data } = await apiClient.post<
      ApiSuccessResponse<{ background: { url: string; publicId: string } }>
    >(`/boards/${boardId}/background`, formData);

    return data.data.background;
  },
};
