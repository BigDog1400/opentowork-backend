import { catchAsync } from "../common/catch-async";
import { handlerFactory } from "../common/handler-factory";
import { Payment } from "../payments/payment.model";
import { Job } from "./job.model";
import paypal from "@paypal/checkout-server-sdk";
import AppError from "../common/app-error";
import { paypalClient } from "../common/paypalClientInstance";

const createPaypalOrder = async ({ value }: { value: string }) =>
  new Promise(async (resolve, reject) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value,
          },
        },
      ],
    });

    try {
      const response = await paypalClient.execute(request);
      resolve(response.result);
    } catch (error) {
      reject(error.message);
    }
  });

const getJob = handlerFactory.getOne(Job);
const getAll = handlerFactory.getAll(Job);
const createJob = catchAsync(async (req, res, next) => {
  req.body = {
    ...req.body,
    user_id: req.user._id,
    company: {
      name: req.user.name,
      photo_url: req.user.photo_url,
    },
  };

  const jobsWithFreeCharge = await Payment.aggregate([
    {
      $match: {
        free_charge: true,
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "job",
        foreignField: "_id",
        as: "job",
      },
    },
    {
      $unwind: "$job",
    },
    {
      $match: {
        "job.active": true,
      },
    },
    {
      $count: "count",
    },
  ]);

  if (jobsWithFreeCharge.length === 0 || jobsWithFreeCharge?.[0] === 0) {
    req.body.active = true;
  }

  const doc = await Job.create(req.body);
  const total = "10";

  let order_id = null;
  if (!doc.active) {
    try {
      await createPaypalOrder({ value: total }).then(({ id }) => {
        order_id = id;
      });
    } catch (error) {
      next(new AppError(error, 400));
    }
  }

  const payment = await Payment.create({
    job: doc._id,
    user: doc.user_id,
    amount: doc.active ? 0 : total,
    currency: "USD",
    description: doc.title,
    created_at: new Date(),
    status: doc.active ? "PAYED" : "PENDING_TO_PAY",
    free_charge: doc.active,
    order_id,
  });

  // get the the name of the model
  const modelName = Job.modelName;

  res.status(201).json({
    status: "success",
    data: {
      [modelName.toLowerCase()]: {
        ...doc.toObject(),
        order_id,
        payment,
      },
    },
  });
});

const setValueFormats = (req, res, next) => {
  // we need to convert the value of the key to a number
  // first need to check if the key starts with salary_range[any]
  const keys = Object.keys(req.query);
  const salaryKeys = keys.filter((key) => key.startsWith("salary_range"));
  salaryKeys.forEach((salaryFilterKey) => {
    // this object will contains the key and the value that are being used to filter
    // ej: salary_range.min: { gt: '3100' }
    const objectFilter = req.query[salaryFilterKey];
    // this will be the key that we will use to filter the value
    const keys = Object.keys(objectFilter);
    keys.forEach((key) => {
      const value = objectFilter[key];
      if (value) {
        req.query[salaryFilterKey][key] = Number(value);
      }
    });
  });

  next();
};

export { getAll, getJob, createJob, setValueFormats };
