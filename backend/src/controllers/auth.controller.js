import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.validatedData);

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          "User registered successfully",
          result,
        ),
      );
  });

  login = asyncHandler(async (req, res) => {
    const data = await authService.login(req.validatedData);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Login successful", data));
  });
}

export default new AuthController();
