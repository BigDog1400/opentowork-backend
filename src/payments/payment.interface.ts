import { Types } from "mongoose";

export interface IPayment {
  job: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  currency: string;
  description: string;
  created_at: Date;
  status?: "PAYED" | "PENDING_TO_PAY" | "CANCELED" | "EXPIRED";
  free_charge?: boolean;
  order_id?: string;
}
