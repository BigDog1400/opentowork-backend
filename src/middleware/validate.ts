import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import AppError from "../common/app-error";

const customError =
  "Invalid request data. Please review request and try again.";

export const validate = ({
  validator,
  useVerboseError,
}: {
  validator: Schema;
  /**
   * Return verbose error message containing all errors
   */
  useVerboseError?: boolean;
}) => {
  // Joi validation options
  const _validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
  };

  // enabled HTTP methods for request data validation
  const _supportedMethods = ["post", "put", "patch"];

  return (req: Request, res: Response, next: NextFunction) => {
    const method = req.method.toLowerCase();
    if (!_supportedMethods.includes(method)) next();

    const result = validator.validate(req.body, _validationOptions);

    if (result.error) {
      if (useVerboseError) {
        const detailsErrorObject = result.error.details.map(
          ({ message, path }) => ({
            [String(path)]: message.replace(/"/g, ""),
          })
        );

        const errorString = detailsErrorObject
          .map((error) => Object.values(error))
          .join(", ");
        return next(new AppError(errorString, 422, detailsErrorObject));
      } else {
        return next(new AppError(customError, 422));
      }
    } else {
      req.body = result.value;
      next();
    }
  };
};
