import { Types } from "mongoose";

export interface IBaseJob {
  userId: Types.ObjectId;
  userName: string;
  title: string;
  location: string[];
  jobType: string;
  minimumExperience: string;
  requiredSkills: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  description: string;
  showSalary: boolean;
  active: boolean;
  instructions: Record<any, unknown>;
  paymentStatus:
    | "PAYED"
    | "PENDING_TO_PAY"
    | "CANCELED"
    | "EXPIRED"
    | "COMPLETED";
}
