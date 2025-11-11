import React from 'react';

const Modal = ({ 
  isOpen, 
  title, 
  message, 
  type = 'info', // 'info', 'error', 'warning', 'success'
  onClose,
  actions = []
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    info: { bgColor: 'bg-blue-50', borderColor: 'border-blue-200', iconColor: 'text-blue-600', titleColor: 'text-blue-900' },
    error: { bgColor: 'bg-red-50', borderColor: 'border-red-200', iconColor: 'text-red-600', titleColor: 'text-red-900' },
    warning: { bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', iconColor: 'text-yellow-600', titleColor: 'text-yellow-900' },
    success: { bgColor: 'bg-green-50', borderColor: 'border-green-200', iconColor: 'text-green-600', titleColor: 'text-green-900' }
  };

  const styles = typeStyles[type] || typeStyles.info;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6V9m0 0V7m0 0v2m6-6H6m6 0h6m0 0h-6m0 0H6" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0-11v2m0 11v2m0-4v2" />
          </svg>
        );
      case 'success':
        return (
          <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return (
          <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-xl max-w-md w-full mx-4 p-6`}>
        {/* Icon and Title */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            {title && (
              <h2 className={`text-lg font-semibold ${styles.titleColor}`}>
                {title}
              </h2>
            )}
            {message && (
              <p className={`mt-2 text-sm ${type === 'error' ? 'text-red-700' : type === 'warning' ? 'text-yellow-700' : type === 'success' ? 'text-green-700' : 'text-blue-700'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          {actions.length > 0 ? (
            actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  action.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : action.primary
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {action.label}
              </button>
            ))
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
