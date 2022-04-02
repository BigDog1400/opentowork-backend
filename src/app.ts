/**
 * Required External Modules
 */
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import { notFoundHandler } from "./middleware/not-found-middleware";
import { usersRouter } from "./users/user.router";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { jobsRouter } from "./jobs/job.router";

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * Routes
 */

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/jobs", jobsRouter);

app.all("*", notFoundHandler);

app.use(globalErrorHandler);

export { app };
