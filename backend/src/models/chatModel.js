/**
 * Stores each chat session in MOngoDB
 * Keeps all messages in a single document
 * supports multi-turn context
 */

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role:{type:String, enum:["User", "AI"], required: true},
    content: {type:String, required: true}
},
{_id: false}
);

const chatSchema = new mongoose.Schema(
  {
    sessionId: { type: Number, unique: true, required: true },
    messages: [messageSchema],
  },
  { timestamps: true } // to add created and updated timestamp
);

export const Chat = mongoose.model("Chat", chatSchema)
 