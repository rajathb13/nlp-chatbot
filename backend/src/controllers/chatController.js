import { Chat } from "../models/chatModel.js";
// Import the correctly instantiated GenerativeModel for chat operations.
import { ai } from "../services/geminiService.js";

// WARNING: In-memory store; chats will be lost on server restart.
const activeChats = {};

/**
 * Maps DB role (User, AI) to Gemini role (user, model).
 */
const mapToGeminiRole = (dbRole) => {
  return dbRole === "User" ? "user" : "model";
};

// Create a new chat session
export const createNewChat = async (req, res) => {
  try {
    // 1. Create a new chat document in MongoDB.
    const chat = new Chat({
      messages: [],
    });
    await chat.save();
    const sessionId = chat._id.toString();

    // 2. Create a new Gemini chat session
    const geminiChat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [],
    });
    activeChats[sessionId] = geminiChat;

    console.log(activeChats)

    // Successful chat creation.
    res.status(201).json({ sessionId });
  } catch (error) {
    console.error("Create Chat Error:", error);
    res
      .status(500)
      .json({ error: "Failed to create chat session", message: error.message });
  }
};

// Send message to current chat
export const sendMessageToChat = async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // 1. Get the chat from MongoDB
    let chat  
    if (sessionId) {
      chat = await Chat.findById(sessionId);
    } else {
      chat = new Chat({ messages: [] });
    }

    // 2. Save user message to MongoDB
    chat.messages.push({
      role: "User",
      content: message,
    });

    // 3. Get the Gemini chat instance
    const geminiChat = activeChats[sessionId];
    if (!geminiChat) {
      return res.status(404).json({ error: "Gemini chat session not found" });
    }

    // 4. Send message to Gemini and get response
    const response = await geminiChat.sendMessage({
      message: message,
    });
    const aiMessage = response.text;

    // 5. Save AI response to MongoDB
    chat.messages.push({
      role: "AI",
      content: aiMessage,
    });
    await chat.save();

    // 6. Send response back to client
    res.json({
      message: aiMessage,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({
      error: "Failed to process message",
      message: error.message,
    });
  }
};

// Endpoint to retrieve history for an existing chat.
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chat = await Chat.findById(sessionId).select("messages");
    if (!chat) return res.status(404).json({ error: "Chat session not found" });

    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().select("_id messages createdAt updatedAt");
    res.status(200).json({ chats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
