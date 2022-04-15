import express, { Router } from "express";
import { auth } from "../middleware/auth";
import * as JobService from "./job.service";

const jobsRouter = express.Router();

jobsRouter
  .route("/")
  .get(JobService.getAll)
  .post(auth.protect, auth.restrictTo("Company"), JobService.createJob);

jobsRouter.route("/:id").get(JobService.getJob);

export { jobsRouter };
