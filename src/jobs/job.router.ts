import express, { Router } from "express";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { paymentRouter } from "../payments/payment.router";
import * as JobService from "./job.service";
import { JobSchema } from "./job.valitate";

const jobsRouter = express.Router();

jobsRouter
  .route("/")
  .get(JobService.getAll)
  .post(
    auth.protect,
    auth.restrictTo("Company"),
    validate({
      validator: JobSchema,
      useVerboseError: true,
    }),
    JobService.createJob
  );

jobsRouter.route("/:id").get(JobService.getJob);
jobsRouter.use("/:id/payment/", paymentRouter);

export { jobsRouter };
