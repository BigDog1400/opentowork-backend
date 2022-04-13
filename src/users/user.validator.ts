import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  cognito_sub: Joi.string(),
  bio: Joi.string(),
  job_role: Joi.string(),
  open_to_work: Joi.boolean(),
  salary_range: Joi.object({
    min: Joi.number().required(),
    max: Joi.number().required(),
  }),
  website: Joi.string(),
  technicalSkills: Joi.array().items(Joi.string()),
  projects: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
    })
  ),
  workExperience: Joi.array().items(
    Joi.object({
      company: Joi.string().required(),
      position: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date(),
      description: Joi.string().required(),
    })
  ),
  socialNetworks: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      url: Joi.string().required(),
    })
  ),
});

export const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
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
