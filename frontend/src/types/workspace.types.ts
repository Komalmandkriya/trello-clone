import type { Avatar } from "./auth.types";

export type WorkspaceRole = "owner" | "admin" | "member";
export type WorkspaceVisibility = "private" | "public";

export interface WorkspaceMemberUser {
  _id: string;
  name: string;
  email: string;
  avatar: Avatar;
}

export interface WorkspaceMember {
  _id: string;
  user: WorkspaceMemberUser;
  role: WorkspaceRole;
}

export interface Workspace {
  _id: string;
  name: string;
  description: string;
  logo: Avatar;
  owner: WorkspaceMemberUser;
  members: WorkspaceMember[];
  visibility: WorkspaceVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
}

export interface UpdateWorkspacePayload {
  name?: string;
  description?: string;
  visibility?: WorkspaceVisibility;
}
