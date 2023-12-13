import { AppError } from "../utils/error-handler.js";
import jwt from "jsonwebtoken";
import { getUserByID } from "../controllers/users.controller.js";
import { USER_TYPES } from "../configs/user-enums.js";
import basicAuth from "basic-auth";

const { ADMIN } = USER_TYPES;

const { JWT_SECRET_KEY, BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } =
  process.env;

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      throw AppError(401, "Unauthorized");
    }

    token = token.split(" ")[1];

    const validate = jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) throw AppError(401, "Invalid token");
      return decoded;
    });

    if (!validate) {
      throw AppError(401, "Unauthorized");
    }

    const { _id } = validate;

    // find user from database
    const { data } = await getUserByID({ ID: _id });

    req.user = data;

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) throw AppError(401, "Unauthorized");

    const { type } = req.user;

    if (type !== ADMIN) throw AppError(403, "Not authorized as admin");

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyBasicAuth = async (req, res, next) => {
  try {
    const credentials = basicAuth(req);
    if (
      !credentials ||
      credentials.name !== BASIC_AUTH_USERNAME ||
      credentials.pass !== BASIC_AUTH_PASSWORD
    ) {
      throw AppError(401, "Invalid authentication credentials.");
    }
    next();
  } catch (error) {
    next(error);
  }
};
