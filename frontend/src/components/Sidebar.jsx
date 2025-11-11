// src/components/Sidebar.jsx
import React from "react";
import ChatList from "./ChatList";

const Sidebar = ({ chats, onSelectChat, activeChat, onDeleteChat, isLoading }) => {
  return (
    <div className="flex flex-col h-screen w-64 bg-[#1E1F22] text-white border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Chats {chats && chats.length > 0 && `(${chats.length})`}</span>
        </h2>
      </div>

      {/* Chat List Component */}
      <ChatList 
        chats={chats}
        onSelectChat={onSelectChat}
        activeChat={activeChat}
        onDeleteChat={onDeleteChat}
        isLoading={isLoading}
      />

      {/* Model name footer */}
      <div className="p-5 text-gray-400 border-t border-gray-700 text-md mb-1">
        Model: <span className="text-gray-200">gemini-2.5-flash</span>
      </div>
    </div>
  );
};

export default Sidebar;
