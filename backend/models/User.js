import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: {
    type: [String], // store coin IDs or symbols
    default: [],
  },
});

export default mongoose.model("User", userSchema);
