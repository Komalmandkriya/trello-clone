import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import Workspace from "../workspace/workspace.model.js";

async function fetchWorkspaceOrThrow(req) {
  const workspaceId =
    req.params.workspaceId ||
    req.validatedData?.workspaceId ||
    req.body.workspaceId;

  if (!mongoose.isValidObjectId(workspaceId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Workspace not found");
  }

  return workspace;
}

export const isWorkspaceMember = asyncHandler(async (req, res, next) => {
  const workspace = req.workspace ?? (await fetchWorkspaceOrThrow(req));
  const isMember = workspace.members.some(
    (member) => member.user.toString() === req.user._id.toString(),
  );

  if (!isMember) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are not a member of this workspace",
    );
  }

  req.workspace = workspace;
  next();
});

export const isWorkspaceOwner = asyncHandler(async (req, res, next) => {
  const workspace = req.workspace ?? (await fetchWorkspaceOrThrow(req));

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Only the workspace owner can perform this action",
    );
  }

  req.workspace = workspace;
  next();
});
