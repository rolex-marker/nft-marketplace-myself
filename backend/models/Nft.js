import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true,
      index: true,
    },

    contractAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    creator: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    owner: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["LISTED", "SOLD", "AUCTION"],
      default: "LISTED",
    },

    price: {
      type: Number, // ETH
    },

    endTime: {
      type: Number, // auction end timestamp (seconds)
    },

    // ✅ OFFERS (simple object array)
    offers: [
      {
        address: {
          type: String,
          lowercase: true,
          index: true,
        },
        price: {
          type: Number, // ETH
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    favoritesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("NFT", NFTSchema);
