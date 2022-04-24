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

usersRouter.get("/", UserService.getAll);

usersRouter.post(
  "/updateMe",
  auth.protect,
  validate({
    validator: updateUserSchema,
    useVerboseError: true,
  }),
  UserService.updateMe
);

usersRouter
  .route("/me")
  .get(auth.protect, UserService.getMe, UserService.getUser);

usersRouter.post(
  "/projects",
  auth.protect,
  validate({
    validator: projectSchema,
  }),
  UserService.addProject
);

usersRouter.post(
  "/social-networks",
  auth.protect,
  validate({
    validator: socialNetworkSchema,
  }),
  UserService.addSocialNetwork
);

usersRouter.post(
  "/work-experience",
  auth.protect,
  validate({
    validator: workExperienceSchema,
    useVerboseError: true,
  }),
  UserService.addWorkExperience
);

usersRouter.route("/:id").get(UserService.getUser);

usersRouter.use(auth.protect);

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

export { usersRouter };
