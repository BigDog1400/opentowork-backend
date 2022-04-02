import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { app } from "./app";

dotenv.config({
  path: `${path.resolve(__dirname, "..")}/config.env`,
});

/**
 * Database Connection
 */

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

if (!process.env.PORT) {
  process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
