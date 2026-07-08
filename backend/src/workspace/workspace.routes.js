import { Router } from "express";
import workspaceController from "./workspace.controller.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "./workspace.validation.js";
import validate from "../middleware/validate.middleware.js";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  isWorkspaceMember,
  isWorkspaceOwner,
} from "../middleware/workspace.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.use(protectedRoute);

router.post(
  "/",
  validate(createWorkspaceSchema),
  workspaceController.createWorkspace,
);
router.get("/", workspaceController.getMyWorkspaces);

router.get(
  "/:workspaceId",
  isWorkspaceMember,
  workspaceController.getWorkspaceById,
);
router.patch(
  "/:workspaceId",
  isWorkspaceMember,
  validate(updateWorkspaceSchema),
  workspaceController.updateWorkspace,
);
router.delete(
  "/:workspaceId",
  isWorkspaceOwner,
  workspaceController.deleteWorkspace,
);

router.post(
  "/:workspaceId/logo",
  isWorkspaceMember,
  upload.single("logo"),
  workspaceController.uploadLogo,
);

export default router;
