import { Schema, model } from "mongoose";
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

export const Payment = model("Payment", paymentSchema);
