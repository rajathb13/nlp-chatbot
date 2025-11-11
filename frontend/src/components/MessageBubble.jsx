import React from 'react';
import PropTypes from 'prop-types';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return null;
  
  const date = typeof timestamp === 'string' 
    ? new Date(timestamp) 
    : timestamp;

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const MessageBubble = ({ role, content, timestamp, createdAt }) => {
  const isUser = role === 'User';
  const timeToShow = timestamp || createdAt;

  return (
    <div
      className={`max-w-[75%] ${
        isUser ? 'ml-auto' : 'mr-auto'
      } flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
    >
      {/* Sender Label */}
      <div className={`text-xs text-gray-500 mb-1 ${isUser ? 'text-right' : 'text-left'}`}>
        {isUser ? 'You' : 'AI Assistant'}
      </div>

      {/* Message Content */}
      <div
        className={`rounded-2xl px-4 py-2 break-words ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        <div className="whitespace-pre-wrap">{content}</div>
      </div>

      {/* Timestamp */}
      {timeToShow && (
        <div className={`text-xs mt-1 text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(timeToShow)}
        </div>
      )}
    </div>
  );
};

MessageBubble.propTypes = {
  role: PropTypes.oneOf(['User', 'AI']).isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
};

export default MessageBubble;