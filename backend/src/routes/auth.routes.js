import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";
import protectedRoute from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken,
);
router.post("/logout", protectedRoute, authController.logout);
router.get("/profile", protectedRoute, authController.profile);

export default router;
