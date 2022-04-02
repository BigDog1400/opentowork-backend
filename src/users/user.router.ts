import express, { Router } from "express";
import * as UserService from "./user.service";

const usersRouter = express.Router();

usersRouter.patch("/updateMe", UserService.updateMe);

usersRouter.route("/").get(UserService.getAll);

usersRouter
  .route("/:id")
  .get(UserService.getUser)
  .patch(UserService.updateUser);

export { usersRouter };
