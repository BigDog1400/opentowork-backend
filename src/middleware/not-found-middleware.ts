import { Request, Response, NextFunction } from "express";
import AppError from "../common/app-error";

export const notFoundHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
};
