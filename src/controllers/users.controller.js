import { UsersModel } from "../models/index.model.js";
import { AppError } from "../utils/error-handler.js";
import { transformSortByString } from "../utils/helper-functions.js";
import { userSignup } from "./auth.controller.js";
import { nodeCache } from "../utils/node-cache.js";
import { clearAllUsersCache } from "../middlewares/users.middleware.js";

export const getAllUsers = async (args) => {
  let { userID, page, limit, sort, q } = args;

  if (!page) page = 0;
  if (page) page--;
  if (!limit) limit = 10;

  // exclude user that is requesting
  const query = {
    _id: {
      $nin: [userID],
    },
  };

  // sort query
  let sortQuery = {};
  if (sort) {
    sortQuery = transformSortByString(sort);
  }

  // search query
  if (q) {
    query.$or = [
      {
        firstName: {
          $regex: q,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: q,
          $options: "i",
        },
      },
      {
        email: {
          $regex: q,
          $options: "i",
        },
      },
    ];
  }

  const data = await UsersModel.find(query)
    .sort(sortQuery)
    .skip(limit * page)
    .limit(limit);

  const totalCount = await UsersModel.find(query).countDocuments();
  const totalPages = Math.ceil(totalCount / limit);

  // cache results
  if (!sort) sort = "";
  if (!q) q = "";
  const key = `get-all-users-page:${page}-limit:${limit}-sort${sort}-q:${q}`;
  nodeCache.set(key, { data, totalCount, totalPages });

  return {
    success: true,
    data,
    totalCount,
    totalPages,
  };
};

export const createUser = async (args) => {
  const data = await userSignup(args);

  // clear all users cache
  clearAllUsersCache();

  return data;
};

export const getUserByID = async (args) => {
  const { ID } = args;

  if (!ID) throw AppError(400, "Invalid user ID");

  const data = await UsersModel.findById(ID);

  if (!data) throw AppError(404, "User not found");

  // set cache
  nodeCache.set(`user:${ID}`, data);

  return { success: true, data, fromCache: false };
};

export const updateUserByID = async (args) => {
  const { ID, lastName, firstName, email } = args;

  if (!ID) throw AppError(400, "Invalid user ID");

  // prepare doc to update
  const doc = {};
  if (firstName) doc.firstName = firstName;
  if (lastName) doc.lastName = lastName;
  if (email) {
    // check if new email already exists excluding user being updated
    const emailExists = await UsersModel.findOne({ email });
    if (emailExists && emailExists._id.toString() !== ID) {
      throw AppError(400, "User with this email already exists.");
    } else {
      doc.email = email;
    }
  }

  const data = await UsersModel.findByIdAndUpdate(
    ID,
    {
      $set: doc,
    },
    { new: true, runValidators: true }
  );

  if (!data) throw AppError(404, "User not found");

  // delete old user cache
  nodeCache.del(`user:${ID}`);

  // clear all users cache
  clearAllUsersCache();

  return { success: true, data };
};

export const deleteUserByID = async (args) => {
  const { ID } = args;

  if (!ID) throw AppError(400, "Invalid user ID");

  const data = await UsersModel.deleteOne({ _id: ID });

  // delete old user cache
  nodeCache.del(`user:${ID}`);
  // clear all users cache
  clearAllUsersCache();

  return { success: true, data };
};
