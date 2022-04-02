import { Schema, model } from "mongoose";
import { IBaseJob } from "./job.inteface";

const jobSchema = new Schema<IBaseJob>({
  userId: { type: Schema.Types.ObjectId, required: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  location: [{ type: String }],
  jobType: { type: String, required: true },
  minimumExperience: { type: String, required: true },
  requiredSkills: [{ type: String }],
  salaryRange: {
    min: Number,
    max: Number,
  },
  description: { type: String, required: true },
  showSalary: { type: Boolean, required: true },
  active: { type: Boolean, required: true, default: true },
  instructions: {},
  paymentStatus: { type: String, required: true },
});

export const Job = model("Job", jobSchema);
