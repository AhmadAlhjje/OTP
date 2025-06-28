"use client";

import React from "react";
import { Eye } from "lucide-react";

interface MessageContentProps {
  message: string;
  onShowFullMessage: () => void;
  maxLength?: number;
}

export const MessageContent: React.FC<MessageContentProps> = ({
  message,
  onShowFullMessage,
  maxLength = 50,
}) => {
  const truncateMessage = (message: string, maxLength: number) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-800 dark:text-gray-200">
        {truncateMessage(message, maxLength)}
      </span>
      {message.length > maxLength && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowFullMessage();
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
          title="عرض الرسالة كاملة"
        >
          <Eye className="w-3 h-3" />
          عرض كامل
        </button>
      )}
    </div>
  );
};
