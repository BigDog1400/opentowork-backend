import { catchAsync } from "../common/catch-async";
import CognitoExpress from "cognito-express";
import AppError from "../common/app-error";
import { config } from "../configs/envVariables";
import { Request, Response, NextFunction } from "express";
import { User } from "../users/user.model";

const cognitoExpress = new CognitoExpress({
  region: config.COGNITO.REGION,
  cognitoUserPoolId: config.COGNITO.USER_POOL_ID,
  tokenUse: "access", //Possible Values: access | id
  tokenExpiration: 3600000, //Up to default expiration of 1 hour (3600000 ms)
});

const protect = catchAsync(async (req, res, next) => {
  const accessTokenFromClient = req.headers.authorization;
  if (!accessTokenFromClient) {
    return next(
      new AppError("Your are not logged in! Please log in to get access", 401)
    );
  }
  const cognitoUser = await cognitoExpress.validate(accessTokenFromClient);

  if (!cognitoUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  let currentUser = await User.findOne({
    cognito_sub: cognitoUser.username,
  });

  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // roles ['Talent','Company']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
export const auth = {
  protect,
  restrictTo,
};
