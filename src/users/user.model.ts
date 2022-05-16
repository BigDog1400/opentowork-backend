import {
  Schema,
  CallbackWithoutResultAndOptionalError,
  model,
  Aggregate,
} from "mongoose";

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
  profile_completed: { type: Boolean, default: false },
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

// findByIdAndUpdate
// findByIdAndDelete
userSchema.pre(/^findOneAnd/, async function (next) {
  const user = await this.findOne().clone();

  if (user.role === "Company") {
    if (!this.getUpdate().name) {
      this.set({
        profile_completed: false,
      });
    } else {
      this.set({
        profile_completed: true,
      });
    }
  }
  if (user.role === "Talent") {
    if (
      !this.getUpdate().name ||
      !this.getUpdate().job_role ||
      !this.getUpdate().bio ||
      !this.getUpdate().technical_skills ||
      !this.getUpdate().salary_expectation
    ) {
      this.set({
        profile_completed: false,
      });
    } else {
      this.set({
        profile_completed: true,
      });
    }
  }

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

userSchema.pre<Aggregate<UserInterface>>("aggregate", function (next) {
  this.pipeline().unshift({
    $match: {
      active: { $ne: false },
      profile_completed: { $ne: false },
    },
  });
  next();
});

export const User = model("User", userSchema);
