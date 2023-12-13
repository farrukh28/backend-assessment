// -------- load env variables
import "./_bin/env-config.js";
// --------

import indexRouter from "./routes/index.route.js";
import express from "express";
import http from "http";
import logger from "morgan";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppError, errorHandler } from "./utils/error-handler.js";
import { getDirNameGlobal } from "./utils/helper-functions.js";
import { connectMongoDB } from "./database/connect.js";
import chalk from "chalk";

const { PORT, NODE_ENV } = process.env;

// start app
const app = express();
const httpServer = http.createServer(app);

const databaseCallbackFunction = async () => {
  // start server
  httpServer.listen(PORT, () => {
    console.log(
      chalk.hex("#FF7000")(`=>>> ${NODE_ENV} server listening on port ${PORT}.`)
    );
  });
};

// connect to database
connectMongoDB(databaseCallbackFunction);

// globals
const __dirname = getDirNameGlobal(import.meta.url);

// middlewares
app.use(cors());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// mount routes
app.get("/", (req, res) => {
  res.status(200).send("<h1>Server is running! 👍</h1>");
});
app.use("/api/v1", indexRouter);

// no file found
app.use("/public/*", (req, res, next) => {
  const message = `Error: No such file!`;
  throw AppError(400, message);
});

// no route found
app.use((req, res, next) => {
  const message = `Error: ${req.method}: ${req.url} => No route found!`;
  throw AppError(400, message);
});

// error handler
app.use(errorHandler);

export default app;
