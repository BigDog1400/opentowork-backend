import { Schema, model } from "mongoose";
import { Payment } from "../payments/payment.model";
import { IBaseJob } from "./job.interface";

const jobSchema = new Schema<IBaseJob>({
  user_id: { type: Schema.Types.ObjectId, required: true },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  company: {
    name: { type: String, required: true },
    photo_url: { type: String, required: true },
  },
  crypto_payment: {
    type: Boolean,
  },
  remote: { type: Boolean, required: true },
  title: { type: String, required: true },
  location: [{ type: Number }],
  job_type: { type: String, required: true },
  minimum_experience: { type: String, required: true },
  required_skills: [{ type: String }],
  salary_range: {
    min: Number,
    max: Number,
  },
  description: { type: String, required: true },
  show_salary: { type: Boolean, required: true },
  active: { type: Boolean, default: false },
  instructions: {},
});

export const Job = model("Job", jobSchema);
