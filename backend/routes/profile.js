import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * GET my profile
 */
router.get("/", auth, async (req, res) => {
  const user = await User.findOne({ address: req.address });
  res.json(user);
});

/**
 * UPDATE my profile
 */
router.put("/", auth, async (req, res) => {
  const { username, bio, avatar } = req.body;

  const user = await User.findOneAndUpdate(
    { address: req.address },
    { username, bio, avatar },
    { new: true, upsert: true }
  );

  res.json(user);
});

export default router;
