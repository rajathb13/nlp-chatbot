import React, { useState } from 'react';
import Modal from './Modal';

const ChatList = ({ chats = [], onSelectChat, activeChat, onDeleteChat, isLoading }) => {
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    chatId: null,
    chatPreview: null
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getChatPreview = (chat) => {
    // Use the title field if available, otherwise fallback to first message
    if (chat.title) {
      return chat.title;
    }
    
    if (!chat.messages || chat.messages.length === 0) {
      return 'New chat';
    }
    
    // Fallback: Get the first user message as preview
    const firstUserMsg = chat.messages.find(m => m.role === 'User');
    if (firstUserMsg && firstUserMsg.content) {
      return firstUserMsg.content.substring(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
    }
    return 'Chat conversation';
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {chats && chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat._id}
            onMouseEnter={() => setHoveredChatId(chat._id)}
            onMouseLeave={() => setHoveredChatId(null)}
            onClick={() => onSelectChat(chat._id)}
            className={`p-3 rounded-lg cursor-pointer transition-all group ${
              activeChat === chat._id
                ? 'bg-gray-700 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {getChatPreview(chat)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(chat.createdAt)}
                </p>
              </div>
              
              {/* Delete button - show on hover */}
              {hoveredChatId === chat._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show confirmation modal instead of deleting immediately
                    setDeleteConfirmModal({
                      isOpen: true,
                      chatId: chat._id,
                      chatPreview: getChatPreview(chat)
                    });
                  }}
                  className="flex-shrink-0 p-1 hover:bg-red-600 rounded transition-colors"
                  title="Delete chat"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">No chats yet</p>
          <p className="text-xs mt-2">Start a conversation to see it here</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmModal.isOpen}
        type="warning"
        title="Delete Chat?"
        message={`Are you sure you want to delete "${deleteConfirmModal.chatPreview}"? This action cannot be undone.`}
        onClose={() => setDeleteConfirmModal({ isOpen: false, chatId: null, chatPreview: null })}
        actions={[
          {
            label: 'Cancel',
            onClick: () => {
              // Modal will close via onClose
            },
            primary: false
          },
          {
            label: 'Delete',
            onClick: () => {
              if (onDeleteChat && deleteConfirmModal.chatId) {
                onDeleteChat(deleteConfirmModal.chatId);
              }
            },
            primary: true,
            variant: 'danger'
          }
        ]}
      />
    </div>
  );
};

export default ChatList;