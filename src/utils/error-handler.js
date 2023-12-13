import fs from "fs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { getDirNameGlobal } from "./helper-functions.js";
import path from "path";

dayjs.extend(utc);

const __dirname = getDirNameGlobal(import.meta.url);

/**
 * @param {number} status status code
 * @param {string} message message of the error
 */
export const AppError = (status = 400, message = "Something went wrong!") => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === "CastError") {
    const message = `Resource not found with id ${err.value}`;
    error = new ErrorHandler(message, 404);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message);
    error = new ErrorHandler(message, 400);
  }

  // duplicate value found
  if (err.code === 11000) {
    let field = Object.keys(err.keyPattern)[0];
    field = field.charAt(0).toUpperCase() + field.slice(1);
    const message = `${field} already used, try another one instead!`;
    error = new ErrorHandler(message, 400);
  }

  const errorMessage = error.message || "Server Error";
  const statusCode = error.statusCode || 500;

  fs.appendFile(
    path.join(__dirname, "..", "logs", "error-logs.txt"),
    `Error - ${dayjs.utc().toISOString()} - ${req.method} ${
      req.url
    } [${statusCode}] - ${errorMessage}\n`,
    (err) => {
      console.log(err);
    }
  );

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
};
