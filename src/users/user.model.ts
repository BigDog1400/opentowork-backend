import { Schema, CallbackWithoutResultAndOptionalError, model } from "mongoose";
import { IBaseUser } from "./user.interface";
const userSchema = new Schema<IBaseUser>({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  website: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["user", "company"],
    default: "user",
  },
  active: { type: Boolean, required: true, default: true },
  technicalSkills: [{ type: String }],
  projects: [
    {
      name: String,
      description: String,
    },
  ],
  workExperience: [
    {
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  socialNetworks: [
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
    this: IBaseUser,
    next: CallbackWithoutResultAndOptionalError
  ): void {
    console.log("New user added");
    next();
  }
);

export const User = model("User", userSchema);
