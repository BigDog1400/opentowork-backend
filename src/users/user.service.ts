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

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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
    "name",
    "bio",
    "job_role",
    "open_to_work",
    "technical_skills",
    "website",
    "projects",
    "work_experience",
    "social_networks",
    "salary_expectation"
  );

  // 3) Update user document
  // the id is hardcode because we don't know yet how to implement jwt from aws cognito
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        projects: {
          _id: req.params.id,
        },
      },
    },
    { new: true }
  );

  res.status(204).json({
    status: "success",
    data: user,
  });
});

const updateProject = catchAsync(async (req, res, next) => {
  // https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/#definition
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        "projects.$[elem].name": req.body.name,
        "projects.$[elem].description": req.body.description,
        "projects.$[elem].url": req.body.url,
      },
    },
    {
      arrayFilters: [
        {
          "elem._id": req.params.id,
        },
      ],
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const addProject = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        projects: {
          name: req.body.name,
          description: req.body.description,
          url: req.body.url,
        },
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const addWorkExperience = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        work_experience: {
          company: req.body.company,
          position: req.body.position,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          description: req.body.description,
        },
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const updateWorkExperience = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        "work_experience.$[elem].company": req.body.company,
        "work_experience.$[elem].position": req.body.position,
        "work_experience.$[elem].startDate": req.body.startDate,
        "work_experience.$[elem].endDate": req.body.endDate,
        "work_experience.$[elem].description": req.body.description,
      },
    },
    {
      arrayFilters: [
        {
          "elem._id": req.params.id,
        },
      ],
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteWorkExperience = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        work_experience: {
          _id: req.params.id,
        },
      },
    },
    { new: true }
  );
  res.status(204).json({
    status: "success",
    data: user,
  });
});

const addSocialNetwork = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        social_networks: {
          name: req.body.name,
          url: req.body.url,
        },
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const updateSocialNetwork = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        "social_networks.$[elem].name": req.body.name,
        "social_networks.$[elem].url": req.body.url,
      },
    },
    {
      arrayFilters: [
        {
          "elem._id": req.params.id,
        },
      ],
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteSocialNetwork = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        social_networks: {
          _id: req.params.id,
        },
      },
    },
    { new: true }
  );
  res.status(204).json({
    status: "success",
    data: user,
  });
});

export {
  getMe,
  getUser,
  updateUser,
  getAll,
  updateMe,
  deleteProject,
  updateProject,
  addProject,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addSocialNetwork,
  updateSocialNetwork,
  deleteSocialNetwork,
};
