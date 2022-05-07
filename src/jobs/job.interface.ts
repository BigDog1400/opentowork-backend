import { Types } from "mongoose";

export interface IBaseJob {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  username: string;
  title: string;
  location: string[];
  job_type: string;
  minimum_experience: string;
  required_skills: string[];
  salary_range: {
    min: number;
    max: number;
  };
  description: string;
  show_salary: boolean;
  active: boolean;
  instructions: string;
}
