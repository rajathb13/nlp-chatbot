// src/components/Sidebar.jsx
import React from "react";

const Sidebar = ({ chats, onNewChat, onSelectChat, activeChatId }) => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          + New Chat
        </button>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No chats yet</p>
        ) : (
          <ul className="space-y-1 p-2">
            {chats.map((chat) => (
              <li
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`p-3 rounded-lg cursor-pointer truncate ${
                  activeChatId === chat._id
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                {chat.messages.length > 0
                  ? chat.messages[0].content.slice(0, 30) + "..."
                  : "New Chat"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
