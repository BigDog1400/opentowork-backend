import { catchAsync } from "../common/catch-async";
import CognitoExpress from "cognito-express";
import AppError from "../common/app-error";
import { config } from "../configs/envVariables";
import { Request, Response, NextFunction } from "express";

const cognitoExpress = new CognitoExpress({
  region: config.COGNITO.REGION,
  cognitoUserPoolId: config.COGNITO.USER_POOL_ID,
  tokenUse: "access", //Possible Values: access | id
  tokenExpiration: 3600000, //Up to default expiration of 1 hour (3600000 ms)
});

const protect = catchAsync(async (req, res, next) => {
  console.log("Request hit");
  const accessTokenFromClient = req.headers.authorization;
  console.log(accessTokenFromClient);
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
  console.log({ cognitoUser });
  req.user = cognitoUser;
  next();
});

const restrictTo = (...roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // roles ['Talent','Company']
    if (!roles.includes(req.user["cognito:groups"][0])) {
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
