import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(HTTP_STATUS.BAD_REQUEST, error.errors[0].message),
        );
      }

      next(error);
    }
  };
};

export default validate;
