import { Schema, model } from "mongoose";
import { USER_TYPES } from "../configs/user-enums.js";

const { ADMIN, USER } = USER_TYPES;

const Users = new Schema(
  {
    email: {
      type: String,
      required: [true, "User email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: [ADMIN, USER],
      default: USER,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 8 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = model("users", Users);

export default UserSchema;
