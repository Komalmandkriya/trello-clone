import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import asyncHandler from "../utils/asyncHandler.js";

const protectedRoute = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired token");
  }
});

export default protectedRoute;
