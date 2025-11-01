import express from 'express'
import { createNewChat, sendMessageToChat, getAllChats } from '../controllers/chatController.js'

const router = express.Router();

//Create a new chat session
router.post('/chats', createNewChat)

//Send message to existing chat
router.post('/chats/:sessionId/message', sendMessageToChat)

//Get all chat sessions
router.get('/getAllChats', getAllChats)