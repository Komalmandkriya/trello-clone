import multer from "multer";
import { HTTP_STATUS } from "../constants/httpStatus.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";

  if (err instanceof multer.MulterError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image must be smaller than 5MB";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
