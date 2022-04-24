import { Request } from "express";
import AppError from "./app-error";
import { catchAsync } from "./catch-async";
import { Model, PopulateOptions } from "mongoose";
import { APIFeatures } from "./api-features";

const getOne = (Model: Model<any>, getOptions?: PopulateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (getOptions) query = query.populate(getOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No tour found with that ID", 404));
    }

    // get the the name of the model
    const modelName = Model.modelName;

    res.status(200).json({
      status: "success",
      data: {
        [modelName.toLowerCase()]: doc,
      },
    });
  });

const updateOne = (Model: Model<any>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No tour found with that ID", 404));
    }

    // get the the name of the model
    const modelName = Model.modelName;

    res.status(200).json({
      status: "success",
      data: {
        [modelName.toLowerCase()]: doc,
      },
    });
  });

const getAll = (Model: Model<any>) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.aggregate(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const totalDocs = await features.query.clone().countDocuments();
    const [{ docs, total }] = await features.query;
    console.log({ docs });
    console.log({ total });
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      data: {
        [Model.collection.name.toLowerCase()]: docs,
      },
      metadata: {
        currentPage: Number(features.queryString.page),
        pageSize: Number(features.queryString.limit),
        totalPages: Math.ceil(
          (total[0]?.count || 0) / Number(features.queryString.limit)
        ),
        totalResults: total[0]?.count || 0,
      },
    });
  });

const createOne = (Model: Model<any>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    // get the the name of the model
    const modelName = Model.modelName;

    res.status(201).json({
      status: "success",
      data: {
        [modelName.toLowerCase()]: doc,
      },
    });
  });

export const handlerFactory = {
  getOne,
  updateOne,
  getAll,
  createOne,
};
