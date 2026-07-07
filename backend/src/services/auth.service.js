import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import generateTokens from "../utils/generateTokens.js";

class AuthService {
  async register(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists");
    }

    // Create user
    const user = await userRepository.create({
      name,
      email,
      password,
    });

    // Generate tokens (also persists the refresh token on the user)
    const tokens = await generateTokens(user);

    // Fetch user without password & refresh token
    const createdUser = await userRepository.findById(user._id);

    return {
      user: createdUser,
      ...tokens,
    };
  }
  // Login Service
  async login(data) {
    const { email, password } = data;
    const user = await userRepository.findByEmail(email, {
      withPassword: true,
    });
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }
    const tokens = await generateTokens(user);
    const loggedInUser = await userRepository.findById(user._id);
    return {
      user: loggedInUser,
      ...tokens,
    };
  }

  // Profile Service
  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user;
  }

  // Logout Service
  async logout(userId) {
    await userRepository.updateRefreshToken(userId, null);
  }

  // Refresh Token Service
  async refreshToken(token) {
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }

    const user = await userRepository.findById(decoded.id, {
      withRefreshToken: true,
    });

    if (!user || user.refreshToken !== token) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }

    return generateTokens(user);
  }
}

export default new AuthService();
