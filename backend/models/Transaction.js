import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  txHash: String,

  buyer: {
    type: String,
    lowercase: true,
    index: true,
  },

  seller: {
    type: String,
    lowercase: true,
    index: true,
  },

  itemId: Number,
  tokenId: Number,
  price: String, // stored as string (wei)
  type: {
    type: String,
    enum: ["BUY", "AUCTION", "OFFER"],
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Transaction", TransactionSchema);
