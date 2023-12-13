import { AppError } from "../utils/error-handler.js";
import bcrypt from "bcrypt";
import { UsersModel } from "../models/index.model.js";
import { getJwtToken } from "../utils/jwt.js";

/**
 * @description user signup
 * @param {string} email user email
 * @param {string} password user password
 */
export const userSignup = async (args) => {
  const { email, password, firstName, lastName } = args;

  if (!email) throw AppError(400, "Email required");
  if (!password) throw AppError(400, "Password required");

  // check if user exists
  const userExists = await UsersModel.findOne({ email });
  if (userExists) throw AppError(400, "User with this email already exists");

  const hash = bcrypt.hashSync(password, 10);

  // prepare data to create user
  const doc = { email, password: hash, firstName, lastName };

  let data = await UsersModel.create(doc);

  data = { ...data._doc };
  delete data.password;

  return { data, success: true };
};

/**
 * @description user login
 * @param {string} email user email
 * @param {string} password user password
 */
export const userLogin = async (args) => {
  const { email, password } = args;

  if (!email) throw AppError(400, "Email required");
  if (!password) throw AppError(400, "Password required");

  // check email
  const userExists = await UsersModel.findOne({ email }).select({
    email: 1,
    password: 1,
    type: 1,
    createdAt: 1,
    firstName: 1,
    lastName: 1,
    fullName: 1,
  });
  if (!userExists) throw AppError(400, "User not registered");

  // check password
  const checkPassword = bcrypt.compareSync(password, userExists.password);
  if (!checkPassword) throw AppError(400, "Password is incorrect");

  const data = { ...userExists._doc };

  // delete password
  delete data.password;

  // generate jwt token
  const token = getJwtToken({ _id: data._id, email });

  return { success: true, data, token };
};
