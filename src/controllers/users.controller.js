import { UsersModel } from "../models/index.model.js";
import { AppError } from "../utils/error-handler.js";
import { transformSortByString } from "../utils/helper-functions.js";
import { userSignup } from "./auth.controller.js";

export const getAllUsers = async (args) => {
  let { userID, page, limit, sort } = args;

  if (!page) page = 0;
  if (page) page--;
  if (!limit) limit = 10;

  // exclude user that is requesting
  const query = {
    _id: {
      $nin: [userID],
    },
  };

  const sortQuery = transformSortByString(sort);

  const data = await UsersModel.find(query)
    .sort(sortQuery)
    .skip(limit * page)
    .limit(limit);

  const totalCount = await UsersModel.find(query).countDocuments();

  return {
    success: true,
    data,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const createUser = async (args) => {
  const data = await userSignup(args);
  return data;
};

export const getUserByID = async (args) => {
  const { ID } = args;

  if (!ID) throw AppError(400, "Invalid user ID");

  const data = await UsersModel.findById(ID);

  if (!data) throw AppError(404, "User not found");

  return { success: true, data, fromCache: false };
};

export const updateUserByID = async (args) => {
  const { ID, lastName, firstName } = args;

  if (!ID) throw AppError(400, "Invalid user ID");

  // prepare doc to update
  const doc = {};
  if (firstName) doc.firstName = firstName;
  if (lastName) doc.lastName = lastName;

  const data = await UsersModel.findByIdAndUpdate(
    ID,
    {
      $set: doc,
    },
    { new: true, runValidators: true }
  );

  if (!data) throw AppError(404, "User not found");

  return { success: true, data };
};

export const deleteUserByID = async (args) => {
  const { ID } = args;

  if (!ID) throw AppError(400, "Invalid user ID");

  const data = await UsersModel.deleteOne({ _id: ID });
  return { success: true, data };
};
