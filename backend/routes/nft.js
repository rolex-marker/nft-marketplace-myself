import express from "express";
import auth from "../middleware/auth.js";
import NFT from "../models/Nft.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * Create NFT entry (after mint)
 */
router.post("/", auth, async (req, res) => {
  try {
    const nft = await NFT.create({
      ...req.body,
      creator: req.address,
      owner: req.address,
    });
    res.json(nft);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "NFT creation failed" });
  }
});

/**
 * Add offer to NFT
 */
router.post("/:id/offer", auth, async (req, res) => {
  const { price } = req.body;

  if (!price || isNaN(price)) {
    return res.status(400).json({ error: "Invalid price" });
  }

  await NFT.findByIdAndUpdate(req.params.id, {
    $push: {
      offers: {
        address: req.address,
        price: Number(price),
      },
    },
  });

  res.json({ success: true });
});

/**
 * Accept offer (seller only)
 */
router.post("/:id/offer/:index/accept", auth, async (req, res) => {
  const nft = await NFT.findById(req.params.id);

  if (!nft) return res.status(404).json({ error: "NFT not found" });
  if (nft.owner !== req.address)
    return res.status(403).json({ error: "Not owner" });

  const offer = nft.offers[req.params.index];
  if (!offer) return res.status(400).json({ error: "Offer not found" });

  nft.owner = offer.address;
  nft.status = "SOLD";
  nft.offers = [];

  await nft.save();
  res.json({ success: true });
});

/**
 * View count
 */
router.post("/:id/view", async (req, res) => {
  await NFT.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 },
  });
  res.json({ success: true });
});

/**
 * Toggle favorite
 */
router.post("/:id/favorite", auth, async (req, res) => {
  const nftId = req.params.id;

  const user = await User.findOne({ address: req.address });
  const isFav = user.favorites.includes(nftId);

  if (isFav) {
    await User.updateOne(
      { address: req.address },
      { $pull: { favorites: nftId } }
    );
    await NFT.findByIdAndUpdate(nftId, { $inc: { favoritesCount: -1 } });
  } else {
    await User.updateOne(
      { address: req.address },
      { $push: { favorites: nftId } }
    );
    await NFT.findByIdAndUpdate(nftId, { $inc: { favoritesCount: 1 } });
  }

  res.json({ favorited: !isFav });
});

export default router;
