'use client';

import React from 'react';

interface CardProps {
  title: string;
  count?: number;
  color: string; // مثل: red-500, green-500...
  icon?: React.ReactNode;
  actionText?: string;
  onActionClick?: () => void;
}

export default function Card({
  title,
  count = 0,
  color,
  icon,
  actionText,
  onActionClick,
}: CardProps) {
  return (
    <div className="bg-white dark:bg-[#004d40] p-4 rounded-lg shadow-md text-center">
      <h3 className={`text-${color} font-bold mb-2`}>{title}</h3>
      <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">{count}</p>
      {icon && <div className="mt-2 text-gray-500">{icon}</div>}
      
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className={`mt-4 w-full px-4 py-2 bg-${color} text-white rounded hover:bg-${color}-600 transition-colors`}
        >
          + {actionText}
        </button>
      )}
    </div>
  );
}