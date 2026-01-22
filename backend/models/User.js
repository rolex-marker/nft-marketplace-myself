import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  username: String,
  bio: String,
  avatar: String,

  totalSpent: {
    type: Number,
    default: 0,
  },
  totalBought: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
