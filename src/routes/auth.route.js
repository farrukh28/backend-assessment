import { Router } from "express";
import { userSignup, userLogin } from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(async (req, res, next) => {
  try {
    const args = { ...req.body };
    const data = await userSignup(args);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.route("/login").post(async (req, res, next) => {
  try {
    const args = { ...req.body };
    const data = await userLogin(args);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
