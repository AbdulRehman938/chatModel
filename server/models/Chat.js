import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // index for fast queries by userId
  },
  userMessage: {
    type: String,
    required: true,
  },
  aiReply: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Chat", ChatSchema);
