import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import Board from "./board.model.js";

async function fetchBoardOrThrow(req) {
  const boardId = req.params.boardId;

  if (!mongoose.isValidObjectId(boardId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid board ID");
  }

  const board = await Board.findById(boardId).populate({
    path: "workspace",
    select: "owner members",
  });

  if (!board) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Board not found");
  }

  return board;
}

export const boardExists = asyncHandler(async (req, res, next) => {
  req.board = await fetchBoardOrThrow(req);
  next();
});

export const isBoardMember = asyncHandler(async (req, res, next) => {
  const board = req.board;

  const isMember = board.workspace.members.some(
    (member) => member.user.toString() === req.user._id.toString(),
  );

  if (!isMember) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are not a member of this workspace",
    );
  }

  next();
});

export const isBoardOwner = asyncHandler(async (req, res, next) => {
  const board = req.board;

  if (board.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Only the board owner can perform this action",
    );
  }

  next();
});
