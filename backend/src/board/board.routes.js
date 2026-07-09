import express from "express";

import boardController from "./board.controller.js";

import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createBoardValidation,
  updateBoardValidation,
} from "./board.validation.js";

import { isWorkspaceMember } from "../middleware/workspace.middleware.js";

import { boardExists, isBoardMember } from "./board.middleware.js";

const router = express.Router();

/**
 * Create Board
 */
router.post(
  "/",
  protect,
  validate(createBoardValidation),
  isWorkspaceMember,
  boardController.createBoard,
);

/**
 * Get Boards of Workspace
 */
router.get(
  "/workspace/:workspaceId",
  protect,
  isWorkspaceMember,
  boardController.getWorkspaceBoards,
);

/**
 * Get Board
 */
router.get(
  "/:boardId",
  protect,
  boardExists,
  isBoardMember,
  boardController.getBoardById,
);

/**
 * Update Board
 */
router.patch(
  "/:boardId",
  protect,
  validate(updateBoardValidation),
  boardExists,
  isBoardMember,
  boardController.updateBoard,
);

/**
 * Archive Board
 */
router.patch(
  "/:boardId/archive",
  protect,
  boardExists,
  isBoardMember,
  boardController.archiveBoard,
);

/**
 * Delete Board
 */
router.delete(
  "/:boardId",
  protect,
  boardExists,
  isBoardMember,
  boardController.deleteBoard,
);

/**
 * Upload Background
 */
router.post(
  "/:boardId/background",
  protect,
  boardExists,
  isBoardMember,
  upload.single("background"),
  boardController.uploadBackground,
);

export default router;
