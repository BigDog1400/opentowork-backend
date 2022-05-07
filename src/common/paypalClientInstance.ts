import { config } from "../configs/envVariables";
import paypal from "@paypal/checkout-server-sdk";

const PaypalEnvironment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

export const paypalClient = new paypal.core.PayPalHttpClient(
  new PaypalEnvironment(config.PAYPAL_CLIENT_ID, config.PAYPAL_CLIENT_SECRET)
);
