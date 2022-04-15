import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: `${path.resolve(__dirname, "..")}/../config.env`,
});

export const config = {
  PORT: process.env.PORT,
  DATABASE: process.env.DATABASE,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  COGNITO: {
    REGION: process.env.COGNITO_REGION,
    USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: process.env.COGNITO_APP_CLIENT_ID,
  },
};
