import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserByID,
  deleteUserByID,
  updateUserByID,
} from "../controllers/users.controller.js";
import {
  verifyToken,
  verifyAdmin,
} from "../middlewares/authenticate.middleware.js";
import {
  cacheUserByID,
  cacheAllUsers,
} from "../middlewares/users.middleware.js";

const router = Router();

router
  .route("/")
  .all(verifyToken, verifyAdmin)
  .get(cacheAllUsers, async (req, res, next) => {
    try {
      const args = { userID: req.user._id, ...req.query };
      const data = await getAllUsers(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const args = { ...req.body };
      const data = await createUser(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/:ID")
  .all(verifyToken, verifyAdmin)
  .get(cacheUserByID, async (req, res, next) => {
    try {
      const args = { ...req.params };
      const data = await getUserByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const args = { ...req.params, ...req.body };
      const data = await updateUserByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const args = { ...req.params };
      const data = await deleteUserByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

export default router;
