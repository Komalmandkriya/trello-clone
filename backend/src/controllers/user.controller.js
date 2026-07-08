import cloudinary from "../config/cloudinary.js";
import deleteTempFile from "../utils/deleteFile.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Please upload an image");
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "trello-clone/avatars",
    });

    user.avatar = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await user.save();

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Avatar uploaded successfully", {
          avatar: user.avatar,
        }),
      );
  } finally {
    deleteTempFile(req.file.path);
  }
});
