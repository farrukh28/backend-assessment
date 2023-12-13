import mongoose from "mongoose";
import chalk from "chalk";

const DatabaseURL = process.env.DATABASE_URL;

/**
 * @description connects to database and executes callback function
 * @param {function} cb function to execute when connection is established
 */
export const connectMongoDB = (cb = null) => {
  mongoose.set("strictQuery", true);
  mongoose.connect(DatabaseURL).then(async () => {
    console.log(chalk.hex("#FF7000")(`=>>> Connected to database`));
    if (cb) {
      await cb();
    }
  });
};
