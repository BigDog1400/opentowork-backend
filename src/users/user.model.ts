import { Schema, CallbackWithoutResultAndOptionalError, model } from "mongoose";

import { User as UserInterface } from "./user.interface";
const userSchema = new Schema<UserInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cognito_sub: { type: String },
  bio: { type: String, required: true },
  job_role: { type: String },
  website: { type: String },
  photo_url: { type: String },
  open_to_work: { type: Boolean, default: true },
  salary_expectation: { type: Number, required: true },
  role: {
    type: String,
    required: true,
    enum: ["Talent", "Company"],
    default: "Talent",
  },
  active: { type: Boolean, required: true, default: true },
  technical_skills: [{ type: String }],
  projects: [
    {
      name: String,
      description: String,
      url: String,
    },
  ],
  work_experience: [
    {
      company: String,
      position: String,
      start_date: Date,
      end_date: Date,
      description: String,
    },
  ],
  social_networks: [
    {
      name: String,
      url: String,
    },
  ],
});

userSchema.pre(/^find/, function (next) {
  // this point to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre(
  "save",
  function (
    this: UserInterface,
    next: CallbackWithoutResultAndOptionalError
  ): void {
    console.log("New user added");
    next();
  }
);

export const User = model("User", userSchema);
