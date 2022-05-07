import express, { Router } from "express";
import { auth } from "../middleware/auth";
import * as PaymentService from "./payment.service";

const paymentRouter = Router({
  mergeParams: true,
});

paymentRouter.use(auth.protect);

paymentRouter
  .route("/:order_id")
  .post(auth.restrictTo("Company"), PaymentService.updatePayment);

export { paymentRouter };
