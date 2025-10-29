import express from 'express'
import { createNewChat, sendMessageToChat } from '../controllers/chatController'

const router = express.Router();

//Create a new chat session
router.post('/chats', createNewChat)

//Send message to existing chat
router.post('/chats/:sessionId/message', sendMessageToChat)

export default router