import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Fetch all chats
export const fetchAllChats = async () => {
  const res = await axios.get(`${API_BASE}/getAllChats`);
  return res.data;
};

// Fetch single chat messages
export const fetchChatMessages = async (sessionId) => {
  if (!sessionId) throw new Error("Session ID is required");
  const res = await axios.get(`${API_BASE}/chats/${sessionId}`);
  return res.data;
};

// Create new chat
export const createNewChat = async () => {
  const res = await axios.post(`${API_BASE}/chats`);
  return res.data;
};

// Send message to chat with streaming
export const sendMessageToChat = async ({ sessionId, message, onChunk }) => {
  if (!sessionId) throw new Error("Session ID is required");
  if (!message) throw new Error("Message is required");

  const response = await fetch(`${API_BASE}/chats/${sessionId}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullMessage = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));

          if (data.error) {
            throw new Error(data.error);
          }

          if (data.done) {
            return { message: data.message };
          }

          if (data.chunk) {
            fullMessage += data.chunk;
            if (onChunk) {
              onChunk(data.chunk, fullMessage);
            }
          }
        } catch {
          // Skip malformed JSON lines
          console.warn("Failed to parse SSE line:", line);
        }
      }
    }
  }

  return { message: fullMessage };
};

// Delete a chat
export const deleteAChatSession = async (sessionId) => {
  if (!sessionId) throw new Error("Session ID is required");

  const res = await axios.delete(`${API_BASE}/chats/${sessionId}`);
  return res.data;
};
