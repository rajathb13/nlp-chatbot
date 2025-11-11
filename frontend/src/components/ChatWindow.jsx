// src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import InputBox from "./InputBox";
import MessageBubble from "./MessageBubble";
import Modal from "./Modal";

/**
 * Props:
 * - sessionId (string|null) : active chat id
 * - messages (array) : [{ role: "User"|"AI", content: "..." , createdAt? }]
 * - onSend(messageText) : async function to call when sending a message (returns the AI reply or full updated messages)
 *
 * This component uses optimistic UI for the user message: it renders the user message immediately,
 * shows a loader for the AI response, then waits for onSend to resolve and appends AI response.
 */

const MAX_WORDS = 500;

// Example card component for the welcome screen
const ExampleCard = ({ title, description }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
    <h4 className="font-medium mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const ChatWindow = ({ sessionId, messages = [], onSend, onNewChat, streamingMessage = "" }) => {
  const [localMessages, setLocalMessages] = useState(messages || []);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const containerRef = useRef(null);

  // Keep localMessages in sync when parent provides new messages
  useEffect(() => {
    setLocalMessages(messages || []);
    scrollToBottom();
  }, [messages, sessionId]);

  // autoscroll helper
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    });
  };

  // Handle sending messages
  const handleSendMessage = async (message) => {
    if (!sessionId) {
      setError("Please select or create a chat session to start messaging");
      setShowModal(true);
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // Optimistic update
      setLocalMessages(prev => [...prev, { 
        role: "User", 
        content: message,
        _id: `local-${Date.now()}`
      }]);
      scrollToBottom();

      // Send to backend and handle response
      const result = await onSend(message);
      
      // Handle different response formats
      if (Array.isArray(result)) {
        setLocalMessages(result);
      } else if (result && typeof result === "object" && Array.isArray(result.messages)) {
        setLocalMessages(result.messages);
      } else if (typeof result === "string") {
        const aiMsg = {
          role: "AI",
          content: result,
          _id: `ai-${Date.now()}`
        };
        setLocalMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      setError(err.message || "Failed to send message");
      // Remove optimistic update on error
      setLocalMessages(messages);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            👽
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">Chatbot</div>
            <div className="text-xs text-gray-500">Active conversation</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 mr-4">
            Model: <span className="font-medium">gemini-2.5-flash</span>
          </div>
          <button
            onClick={onNewChat}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
        data-testid="messages-container"
      >
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold mb-4">How can I assist you today?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
              <ExampleCard
                title="Personal Branding"
                description="Help me create a personal branding and web page"
              />
              <ExampleCard
                title="Data Analysis"
                description="Write a report based on my website data"
              />
              <ExampleCard
                title="Content Writing"
                description="Write tailored, engaging content with focus on quality"
              />
            </div>
          </div>
        ) : (
          <>
            {localMessages.map((msg, idx) => (
              <MessageBubble
                key={msg._id ?? `${msg.role}-${idx}`}
                role={msg.role}
                content={msg.content}
                timestamp={msg.createdAt}
              />
            ))}
            
            {/* Show streaming AI response */}
            {streamingMessage && (
              <MessageBubble
                key="streaming"
                role="AI"
                content={streamingMessage}
              />
            )}
          </>
        )}

        {isSending && !streamingMessage && (
          <div className="max-w-[75%] mr-auto">
            <div className="inline-block px-4 py-2 rounded-2xl bg-white text-gray-800 border border-gray-200">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <InputBox 
        onSendMessage={handleSendMessage}
        isLoading={isSending}
        disabled={!sessionId}
        placeholder={sessionId ? "Type your message..." : "Select or create a chat session first"}
      />
      
      {/* Modal for errors */}
      <Modal
        isOpen={showModal}
        title="No Chat Selected"
        message={error}
        type="error"
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

// Small typing animation
const TypingDots = () => {
  return (
    <div className="flex items-center space-x-1">
      <span
        className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "0s" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "0.15s" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
};

export default ChatWindow;
