import { Types } from "mongoose";

export interface IBaseJob {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  createdAt: number;
  company: {
    name: string;
    photo_url: string;
  };
  title: string;
  location: number[];
  job_type: string;
  remote: boolean;
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
