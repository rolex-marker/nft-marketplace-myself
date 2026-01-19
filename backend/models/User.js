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
  avatar: String, // image URL or IPFS
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
