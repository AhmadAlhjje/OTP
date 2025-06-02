'use client';

import React from 'react';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-gray-900';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div
      className={`${getToastStyles()}
        fixed bottom-12 left-10 px-6 py-3 rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        flex items-center justify-between max-w-xs z-50`}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-4 text-xl font-bold"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;