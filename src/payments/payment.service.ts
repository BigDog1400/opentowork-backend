import AppError from "../common/app-error";
import { catchAsync } from "../common/catch-async";
import { Payment } from "./payment.model";
import paypal from "@paypal/checkout-server-sdk";
import { paypalClient } from "../common/paypalClientInstance";

const updatePayment = catchAsync(async (req, res, next) => {
  // first we need to query the payment from paypal
  const request = new paypal.orders.OrdersGetRequest(req.params.order_id);
  const { result } = await paypalClient.execute(request);
  if (result.status !== "COMPLETED") {
    throw new AppError("Payment not completed", 400);
  }

  const payment = await Payment.findOneAndUpdate(
    {
      order_id: req.params.order_id,
    },
    {
      status: "PAYED",
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!payment) {
    return next(new AppError("No payment found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      payment,
    },
  });
});

export { updatePayment };
