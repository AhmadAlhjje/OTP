'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface CardProps {
  title: string;
  content?: React.ReactNode;
  color: string; // مثل: green-600
  icon?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  count?: number; // ← تمت إضافتها بشكل صحيح
  actionText?: string; // ← أضفنا هذه
  onActionClick?: () => void;
}

export default function Card({
  title,
  content,
  color,
  icon,
  onEdit,
  onDelete,
  count,
}: CardProps) {
  return (
    <div className="bg-white dark:bg-[#004d40] p-4 rounded-lg shadow-md text-right relative h-full flex flex-col justify-between">
      {/* المحتوى الرئيسي */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-${color} font-bold`}>{title}</h3>
          {typeof count === 'number' && (
            <span className="text-lg font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {count}
            </span>
          )}
        </div>

        {content && (
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
            {content}
          </p>
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
