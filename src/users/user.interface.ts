import { Types, Document } from "mongoose";

export interface User {
  _id: Types.ObjectId;
  name: string;
  email: string;
  cognito_sub: string;
  website: string;
  job_role: string;
  photo_url: string;
  open_to_work: boolean;
  salary_expectation?: number;
  bio: string;
  role: "Talent" | "Company";
  active: boolean;
  technical_skills?: string[];
  projects?: {
    name: string;
    description: string;
    url: string;
  }[];
  work_experience?: {
    company: string;
    position: string;
    start_date: Date;
    end_date: Date | null;
    description: string;
  }[];
  social_networks?: {
    name: string;
    url: string;
  }[];
  profile_completed: boolean;
}
