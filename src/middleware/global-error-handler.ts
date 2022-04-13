import { NextFunction, Response, Request } from "express";
import AppError from "../common/app-error";

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleJWTExpiredError = () =>
  new AppError("Your token has expired!. Please log in again!", 401);

interface IGlobalErrorHandler {
  (err: any, req: Request, res: Response, next: NextFunction): void;
}

const globalErrorHandler: IGlobalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "CastError")
      return sendErrorProd(handleCastErrorDB(err), res);
    if (err.name === "TokenExpiredError")
      return sendErrorProd(handleJWTExpiredError(), res);

    return sendErrorProd(err, res);
  }
};

export { globalErrorHandler };
