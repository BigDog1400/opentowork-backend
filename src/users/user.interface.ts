import { Types, Document } from "mongoose";

export interface IBaseUser {
  name: string;
  website: string;
  bio: string;
  role: "user" | "company";
  active: boolean;
  technicalSkills: string[];
  projects: {
    name: string;
    description: string;
  }[];
  workExperience: {
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    description: string;
  }[];
  socialNetworks: {
    name: string;
    url: string;
  }[];
}

export interface IUser extends Document {
  _id: Types.ObjectId;
}
