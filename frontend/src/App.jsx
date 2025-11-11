import React, { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx"
import { useChats, useChatMessages, useSendMessage, useDeleteChat, useCreateChat } from "./hooks/useChats";

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  
  // React Query hooks for fetching data
  const { data: chats = [] } = useChats();
  const { data: chatData } = useChatMessages(sessionId);
  const messages = chatData?.messages || [];
  
  // React Query hooks for mutations
  const { mutateAsync: sendMessage } = useSendMessage();
  const { mutate: deleteChat } = useDeleteChat();
  const { mutateAsync: createChat } = useCreateChat();

  // Handle sending a message with streaming
  const handleSendMessage = async (userText) => {
    setStreamingMessage(""); // Reset streaming message
    
    try {
      // If no active session, create one first
      let activeSessionId = sessionId;
      if (!activeSessionId) {
        const newChatData = await createChat();
        activeSessionId = newChatData.sessionId;
        setSessionId(activeSessionId);
      }

      await sendMessage({
        sessionId: activeSessionId,
        message: userText,
        onChunk: (chunk, fullMessage) => {
          setStreamingMessage(fullMessage);
        }
      });
      setStreamingMessage(""); // Clear after complete
    } catch (error) {
      console.error("Error sending message:", error);
      setStreamingMessage("");
      throw error;
    }
  };

  // Handle deleting a chat
  const handleDeleteChat = (chatId) => {
    deleteChat(chatId, {
      onSuccess: () => {
        if (sessionId === chatId) {
          setSessionId(null);
        }
      }
    });
  };

  // Handle creating a new chat
  const handleNewChat = () => {
    createChat(undefined, {
      onSuccess: (data) => {
        // Set the new chat as active
        if (data?.sessionId) {
          setSessionId(data.sessionId);
        }
      }
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar 
        chats={chats} 
        onSelectChat={setSessionId}
        activeChat={sessionId}
        onDeleteChat={handleDeleteChat}
        isLoading={false}
      />

      {/* Chat Window on the right */}
      <div className="flex-1">
        <ChatWindow
          sessionId={sessionId}
          messages={messages}
          onSend={handleSendMessage}
          onNewChat={handleNewChat}
          streamingMessage={streamingMessage}
        />
      </div>
    </div>
  );
};

export default App;
