import { Schema, model } from "mongoose";
import { Job } from "../jobs/job.model";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
  job: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  description: { type: String, required: true },
  created_at: { type: Date, required: true },
  status: { type: String, default: "PENDING_TO_PAY" },
  free_charge: { type: Boolean, default: false },
  order_id: Schema.Types.Mixed,
});

paymentSchema.statics.activeJobRelated = async function (jobId) {
  await Job.findByIdAndUpdate(jobId, {
    active: true,
  });
};

paymentSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  next();
});

paymentSchema.post(/^findOneAnd/, async function (result) {
  if (result.status === "PAYED") {
    await this.r.constructor.activeJobRelated(this.r.job);
  }
});

export const Payment = model("Payment", paymentSchema);
