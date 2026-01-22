import express from "express";
import auth from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * Save transaction
 */
router.post("/", auth, async (req, res) => {
  try {
    const {
      itemId,
      tokenId,
      price,
      seller,
      buyer,
      type,
      txHash
    } = req.body;

    // 🔐 Validate
    if (!price || isNaN(price)) {
      return res.status(400).json({ error: "Invalid price" });
    }

    const priceEth = Number(price);

    // 1️⃣ Save transaction
    const tx = await Transaction.create({
      itemId,
      tokenId,
      price: priceEth,
      seller,
      buyer,
      type,
      txHash
    });

    // 2️⃣ Update buyer analytics
    await User.findOneAndUpdate(
      { address: buyer.toLowerCase() },
      {
        $inc: {
          totalSpent: priceEth,
          totalBought: 1
        }
      },
      { upsert: true }
    );

    res.json(tx);
  } catch (err) {
    console.error("Transaction error:", err);
    res.status(500).json({ error: "Transaction failed" });
  }
});


/**
 * My transactions
 */
router.get("/me", auth, async (req, res) => {
  const txs = await Transaction.find({
    $or: [
      { buyer: req.address },
      { seller: req.address },
    ],
  }).sort({ timestamp: -1 });

  res.json(txs);
});

export default router;
