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

router.get("/top-sellers", async (req, res) => {
  try {
    const topSellers = await User.find()
      .sort({ totalSpent: -1 }) // sort by total ETH sold descending
      .limit(6); // only top 6
    res.json(topSellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top sellers" });
  }
});


router.get("/:address", async (req, res) => {
  const user = await User.findOne({ address: req.params.address.toLowerCase() });
  res.json(user || { address: req.params.address });
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
