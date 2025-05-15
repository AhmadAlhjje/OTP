'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface CardProps {
  title: string;
  content?: string;
  color: string; // مثل: green-600
  icon?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function Card({
  title,
  content,
  color,
  icon,
  onEdit,
  onDelete,
}: CardProps) {
  return (
    <div className="bg-white dark:bg-[#004d40] p-4 rounded-lg shadow-md text-right relative h-full flex flex-col justify-between">
      {/* المحتوى الرئيسي */}
      <div>
        <h3 className={`text-${color} font-bold mb-2`}>{title}</h3>
        {content && (
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">{content}</p>
        )}
        {icon && <div className="mt-2 text-gray-500">{icon}</div>}
      </div>

      {/* الأزرار في الأسفل */}
      {(onEdit || onDelete) && (
        <div className="flex justify-between items-center mt-4">
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 transition"
              title="حذف"
            >
              <Trash2 size={20} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-green-600 hover:text-green-800 transition"
              title="تعديل"
            >
              <Pencil size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
