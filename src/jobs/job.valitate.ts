import Joi from "joi";
import { IBaseJob } from "./job.interface";

export const JobSchema = Joi.object<IBaseJob>({
  active: Joi.boolean(),
  description: Joi.string().required(),
  company: Joi.object({
    name: Joi.string(),
  }),
  instructions: Joi.string().required(),
  remote: Joi.boolean(),
  job_type: Joi.string().required(),
  location: Joi.array().items(Joi.number()).required(),
  minimum_experience: Joi.string().required(),
  required_skills: Joi.array().items(Joi.string()).required(),
  salary_range: Joi.object({
    max: Joi.number().required(),
    min: Joi.number().required(),
  }).required(),
  show_salary: Joi.boolean().required(),
  title: Joi.string().required(),
});
