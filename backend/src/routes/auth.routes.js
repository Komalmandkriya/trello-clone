import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { registerSchema } from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
export default router;
