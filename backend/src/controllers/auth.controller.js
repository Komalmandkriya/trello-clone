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

  profile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user._id);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Profile fetched successfully", user),
      );
  });

  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user._id);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Logout successful"));
  });

  refreshToken = asyncHandler(async (req, res) => {
    const tokens = await authService.refreshToken(
      req.validatedData.refreshToken,
    );

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Token refreshed successfully", tokens),
      );
  });
}

export default new AuthController();
