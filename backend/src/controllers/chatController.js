import { Chat } from "../models/chatModel.js";
// Import the correctly instantiated GenerativeModel for chat operations.
import { ai } from "../services/geminiService.js";
import removeMarkdown from "remove-markdown";

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

    // Successful chat creation.
    res.status(201).json({ sessionId });
  } catch (error) {
    console.error("Create Chat Error:", error);
    res
      .status(500)
      .json({ error: "Failed to create chat session", message: error.message });
  }
};

// Send message to current chat with streaming
export const sendMessageToChat = async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Word count validation
  const wordCount = message
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  if (wordCount > 500) {
    return res.status(400).json({ error: "Message exceeds 500 word limit" });
  }

  try {
    // 1. Get the chat from MongoDB
    let chat;
    if (sessionId) {
      chat = await Chat.findById(sessionId);
      if (!chat) {
        return res.status(404).json({ error: "Chat session not found" });
      }
    } else {
      chat = new Chat({ messages: [] });
    }

    // 2. Save user message to MongoDB
    chat.messages.push({
      role: "User",
      content: message,
    });

    // 2a. Auto-generate title from first message (first 6 words)
    if (chat.messages.length === 1) {
      const words = message.trim().split(/\s+/);
      const titleWords = words.slice(0, 6).join(" ");
      chat.title = titleWords + (words.length > 6 ? "..." : "");
    }

    // 3. Get or recreate the Gemini chat instance
    let geminiChat = activeChats[sessionId];
    if (!geminiChat) {
      // Recreate Gemini chat from existing message history in DB
      const history = chat.messages.map((msg) => ({
        role: mapToGeminiRole(msg.role),
        parts: [{ text: msg.content }],
      }));
      geminiChat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: history,
      });
      activeChats[sessionId] = geminiChat;
    }

    // 4. Set up Server-Sent Events (SSE) for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullAiMessage = "";

    // 5. Stream response from Gemini
    const stream = await geminiChat.sendMessageStream({
      message: message,
    });

    for await (const chunk of stream) {
      const chunkText = chunk.text;
      fullAiMessage += chunkText;

      // Strip markdown from chunk and send to client
      const cleanedChunk = removeMarkdown(chunkText);
      res.write(`data: ${JSON.stringify({ chunk: cleanedChunk })}\n\n`);
    }

    // 6. Strip markdown from full message and save to DB
    const cleanedAiMessage = removeMarkdown(fullAiMessage);

    chat.messages.push({
      role: "AI",
      content: cleanedAiMessage,
    });
    await chat.save();

    // 7. Send final event with complete message
    res.write(
      `data: ${JSON.stringify({ done: true, message: cleanedAiMessage })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error("Send Message Error:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Failed to process message" })}\n\n`
    );
    res.end();
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
    const chats = await Chat.find().select(
      "_id title messages createdAt updatedAt"
    );
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const deletedChat = await Chat.findByIdAndDelete(sessionId);

    if (!deletedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Also remove from active chats in memory
    delete global.activeChats?.[sessionId];

    res.status(200).json({
      message: "Chat deleted successfully",
      deletedId: sessionId,
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({
      error: "Failed to delete chat",
      message: error.message,
    });
  }
};
