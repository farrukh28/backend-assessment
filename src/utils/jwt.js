import jwt from "jsonwebtoken";
import { AppError } from "./error-handler.js";

const { JWT_SECRET_KEY } = process.env;

/**
 * @description assigns a token
 * @param {object} payload
 * @returns {string} token
 */
export const getJwtToken = (payload) => {
  if (!payload) AppError(400, "Payload missing");

  const payloadKeys = Object.keys(payload);
  payloadKeys.forEach((key) => {
    if (!payload[key]) {
      throw AppError(400, "Invalid jwt payload.");
    }
  });

  const data = jwt.sign(payload, JWT_SECRET_KEY, {});
  return data;
};
