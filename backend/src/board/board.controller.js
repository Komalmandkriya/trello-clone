import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import deleteTempFile from "../utils/deleteFile.js";
import boardService from "./board.service.js";

class BoardController {
  createBoard = asyncHandler(async (req, res) => {
    const board = await boardService.createBoard(
      req.user._id,
      req.workspace,
      req.validatedData,
    );

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          "Board created successfully",
          board,
        ),
      );
  });

  getWorkspaceBoards = asyncHandler(async (req, res) => {
    const boards = await boardService.getWorkspaceBoards(req.workspace._id);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Boards fetched successfully", boards),
      );
  });

  getBoardById = asyncHandler(async (req, res) => {
    const board = await boardService.getBoardById(req.board);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Board fetched successfully", board),
      );
  });

  updateBoard = asyncHandler(async (req, res) => {
    const board = await boardService.updateBoard(req.board, req.validatedData);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Board updated successfully", board),
      );
  });

  archiveBoard = asyncHandler(async (req, res) => {
    const board = await boardService.archiveBoard(req.board);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Board archived successfully", board),
      );
  });

  deleteBoard = asyncHandler(async (req, res) => {
    await boardService.deleteBoard(req.board);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Board deleted successfully"));
  });

  uploadBackground = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please upload an image");
    }

    try {
      const background = await boardService.uploadBackground(
        req.board,
        req.file.path,
      );

      return res
        .status(HTTP_STATUS.OK)
        .json(
          new ApiResponse(
            HTTP_STATUS.OK,
            "Board background uploaded successfully",
            { background },
          ),
        );
    } finally {
      deleteTempFile(req.file.path);
    }
  });
}

export default new BoardController();
