import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

class AuthService {
  async register(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists");
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Fetch user without password & refresh token
    const createdUser = await User.findById(user._id);

    return {
      user: createdUser,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
