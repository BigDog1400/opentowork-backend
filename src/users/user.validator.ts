import Joi from "joi";

export const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  url: Joi.string(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  cognito_sub: Joi.string(),
  bio: Joi.string(),
  job_role: Joi.string(),
  open_to_work: Joi.boolean(),
  salary_expectation: Joi.number(),
  website: Joi.string(),
  photo_url: Joi.string(),
  technical_skills: Joi.array().items(Joi.string()),
  projects: Joi.array().items(projectSchema),
  work_experience: Joi.array().items(
    Joi.object({
      company: Joi.string().required(),
      position: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date(),
      description: Joi.string().required(),
    })
  ),
  social_networks: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      url: Joi.string().required(),
    })
  ),
});

export const socialNetworkSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
});

export const workExperienceSchema = Joi.object({
  company: Joi.string().required(),
  position: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date(),
  description: Joi.string().required(),
});
