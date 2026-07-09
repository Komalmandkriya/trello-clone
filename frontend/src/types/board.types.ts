import type { Avatar } from "./auth.types";
import type { Workspace } from "./workspace.types";

export interface BoardBackground {
  url: string;
  publicId: string;
}

export interface BoardOwner {
  _id: string;
  name: string;
  email: string;
  avatar: Avatar;
}

export interface Board {
  _id: string;
  name: string;
  description: string;
  workspace: Workspace;
  owner: BoardOwner;
  background: BoardBackground;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardPayload {
  workspaceId: string;
  name: string;
  description?: string;
}

export interface UpdateBoardPayload {
  name?: string;
  description?: string;
}
