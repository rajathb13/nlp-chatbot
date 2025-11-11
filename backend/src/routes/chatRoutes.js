import express from "express";
import {
  createNewChat,
  sendMessageToChat,
  getAllChats,
  getChatHistory,
  deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

//Create a new chat session
router.post("/chats", createNewChat);

//Get all chat sessions
router.get("/getAllChats", getAllChats);

//Get specific chat history
router.get("/chats/:sessionId", getChatHistory);

//Send message to existing chat
router.post("/chats/:sessionId/message", sendMessageToChat);

//Delete a chat
router.delete("/chats/:sessionId", deleteChat);

export default router;
