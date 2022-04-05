import mongoose from "mongoose";
import { app } from "./app";
import { config } from "./configs/envVariables";

/**
 * Database Connection
 */

const DB = config.DATABASE.replace("<PASSWORD>", config.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

if (!config.PORT) {
  process.exit(1);
}
const PORT: number = parseInt(config.PORT as string, 10);

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
