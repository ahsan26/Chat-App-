import mongoose from "mongoose";

module.exports = mongoose.model("message", new mongoose.Schema({
  nickname: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
}));
