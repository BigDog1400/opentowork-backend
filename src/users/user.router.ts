import express, { Router } from "express";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import * as UserService from "./user.service";
import {
  updateUserSchema,
  projectSchema,
  workExperienceSchema,
  socialNetworkSchema,
} from "./user.validator";

const usersRouter = express.Router();

usersRouter.use(auth.protect);

usersRouter.post(
  "/updateMe",
  validate({
    validator: updateUserSchema,
    useVerboseError: true,
  }),
  UserService.updateMe
);

usersRouter.get("/me", UserService.getMe, UserService.getUser);

usersRouter.post(
  "/projects",
  validate({
    validator: projectSchema,
  }),
  UserService.addProject
);

usersRouter.post(
  "/social-networks",
  validate({
    validator: socialNetworkSchema,
  }),
  UserService.addSocialNetwork
);

usersRouter.post(
  "/work-experience",
  validate({
    validator: workExperienceSchema,
    useVerboseError: true,
  }),
  UserService.addWorkExperience
);

usersRouter
  .route("/projects/:id")
  .delete(UserService.deleteProject)
  .patch(
    validate({
      validator: projectSchema,
    }),
    UserService.updateProject
  );

usersRouter
  .route("/social-networks/:id")
  .delete(UserService.deleteSocialNetwork)
  .patch(
    validate({
      validator: socialNetworkSchema,
    }),
    UserService.updateSocialNetwork
  );

usersRouter
  .route("/work-experience/:id")
  .delete(UserService.deleteWorkExperience)
  .patch(
    validate({
      validator: workExperienceSchema,
    }),
    UserService.updateWorkExperience
  );

// usersRouter.use(auth.protect);

usersRouter.route("/").get(UserService.getAll);
// .patch(UserService.updateUser);

export { usersRouter };
