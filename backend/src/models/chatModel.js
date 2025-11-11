/**
 * Stores each chat session in MongoDB
 * Keeps all messages in a single document
 * supports multi-turn context
 */

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["User", "AI"], required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt for each message
    _id: true, // ensures each message gets its own _id
  }
);

const chatSchema = new mongoose.Schema(
  {
    title: { type: String, default: "New Chat" },
    messages: [messageSchema],
  },
  { timestamps: true } // to add created and updated timestamp for the chat
);

export const Chat = mongoose.model("Chat", chatSchema);
