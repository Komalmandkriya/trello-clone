import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import deleteTempFile from "../utils/deleteFile.js";
import workspaceService from "./workspace.service.js";

class WorkspaceController {
  createWorkspace = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.createWorkspace(
      req.user._id,
      req.validatedData,
    );

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          "Workspace created successfully",
          workspace,
        ),
      );
  });

  getMyWorkspaces = asyncHandler(async (req, res) => {
    const workspaces = await workspaceService.getMyWorkspaces(req.user._id);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "Workspaces fetched successfully",
          workspaces,
        ),
      );
  });

  getWorkspaceById = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.getWorkspaceById(req.workspace);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "Workspace fetched successfully",
          workspace,
        ),
      );
  });

  updateWorkspace = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.updateWorkspace(
      req.workspace,
      req.validatedData,
    );

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "Workspace updated successfully",
          workspace,
        ),
      );
  });

  deleteWorkspace = asyncHandler(async (req, res) => {
    await workspaceService.deleteWorkspace(req.workspace);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Workspace deleted successfully"));
  });

  uploadLogo = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please upload an image");
    }

    try {
      const logo = await workspaceService.uploadLogo(
        req.workspace,
        req.file.path,
      );

      return res
        .status(HTTP_STATUS.OK)
        .json(
          new ApiResponse(
            HTTP_STATUS.OK,
            "Workspace logo uploaded successfully",
            { logo },
          ),
        );
    } finally {
      deleteTempFile(req.file.path);
    }
  });
}

export default new WorkspaceController();
