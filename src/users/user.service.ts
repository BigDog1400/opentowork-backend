import AppError from "../common/app-error";
import { catchAsync } from "../common/catch-async";
import { handlerFactory } from "../common/handler-factory";
import { User } from "./user.model";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getUser = handlerFactory.getOne(User);
const getAll = handlerFactory.getAll(User);

// THIS IS RESTRICTED TO ADMIN ONLY
const updateUser = handlerFactory.updateOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "bio",
    "technicalSkills",
    "website",
    "projects",
    "workExperience",
    "socialNetworks"
  );

  console.log({ filteredBody });

  // 3) Update user document
  // the id is hardcode because we don't know yet how to implement jwt from aws cognito
  const updatedUser = await User.findByIdAndUpdate(
    "62318744fd85474e040cad59",
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
export { getUser, updateUser, getAll, updateMe };
