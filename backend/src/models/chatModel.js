/**
 * Stores each chat session in MongoDB
 * Keeps all messages in a single document
 * supports multi-turn context
 */

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    messages: [{
      role:{type:String, enum:["User", "AI"], required: true},
      content: {type:String, required: true}
    }],
  },
  { timestamps: true } // to add created and updated timestamp
);

export const Chat = mongoose.model("Chat", chatSchema)
 