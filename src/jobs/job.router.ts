import express, { Router } from "express";
import * as JobService from "./job.service";

const jobsRouter = express.Router();

jobsRouter.route("/").get(JobService.getAll);

jobsRouter.route("/:id").get(JobService.getJob);

export { jobsRouter };
