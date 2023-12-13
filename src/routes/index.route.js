import express from "express";
import users from "./users.route.js";
import auth from "./auth.route.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Home route 😊!");
});

router.use("/auth", auth);
router.use("/users", users);

router.get("/docs", (req, res) => {
  res.redirect("https://www.google.com");
});

export default router;
