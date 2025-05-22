'use client';

import React from 'react';
import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  content?: React.ReactNode;
  color: string;
  icon?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  count?: number;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

// تعريف نوع لخريطة الألوان
interface ColorMap {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
    iconBg: string;
  };
}

export default function Card({
  title,
  content,
  color,
  icon,
  onEdit,
  onDelete,
  count,
  actionText,
  onActionClick,
  className = '',
}: CardProps) {
  // تحويل سلسلة اللون إلى الصيغة الصحيحة للتصميم
  const getColorClasses = () => {
    // الألوان الشائعة
    const colorMap: ColorMap = {
      'green': {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-500',
        border: 'border-green-200 dark:border-green-800',
        iconBg: 'bg-green-100 dark:bg-green-800/50'
      },
      'blue': {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-500',
        border: 'border-blue-200 dark:border-blue-800',
        iconBg: 'bg-blue-100 dark:bg-blue-800/50'
      },
      'red': {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-500',
        border: 'border-red-200 dark:border-red-800',
        iconBg: 'bg-red-100 dark:bg-red-800/50'
      },
      'yellow': {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-500',
        border: 'border-yellow-200 dark:border-yellow-800',
        iconBg: 'bg-yellow-100 dark:bg-yellow-800/50'
      },
      'purple': {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-700 dark:text-purple-500',
        border: 'border-purple-200 dark:border-purple-800',
        iconBg: 'bg-purple-100 dark:bg-purple-800/50'
      },
      'gray': {
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        text: 'text-gray-700 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-700',
        iconBg: 'bg-gray-100 dark:bg-gray-700'
      }
    };

    // استخراج اللون الأساسي من السلسلة (مثل green-600 -> green)
    const baseColor = color.split('-')[0];
    
    // إرجاع فئات اللون المناسبة أو الافتراضية إذا لم يتم العثور عليها
    return colorMap[baseColor] || colorMap.gray;
  };

  const colorClasses = getColorClasses();

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white dark:bg-gray-800 
        border ${colorClasses.border} 
        rounded-xl shadow-sm hover:shadow-md 
        transition-all duration-300 
        overflow-hidden
        flex flex-col justify-between h-full
        ${className}
      `}
    >
      {/* رأس البطاقة مع العنوان والعداد */}
      <div className={`${colorClasses.bg} p-4 border-b ${colorClasses.border}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold ${colorClasses.text} flex items-center gap-2`}>
            {icon && (
              <span className={`${colorClasses.iconBg} p-1.5 rounded-full`}>
                {icon}
              </span>
            )}
            <span>{title}</span>
          </h3>
          
          {typeof count === 'number' && (
            <span className={`
              ${colorClasses.text} font-bold 
              ${colorClasses.bg} 
              px-2.5 py-1 rounded-full text-sm
              border ${colorClasses.border}
            `}>
              {count}
            </span>
          )}
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-4 flex-grow">
        {content}
      </div>

      {/* تذييل البطاقة مع الإجراءات */}
      {(onEdit || onDelete || onActionClick) && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full transition-colors"
                title="حذف"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
            
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className={`${colorClasses.text} hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors`}
                title="تعديل"
              >
                <Pencil size={16} />
              </motion.button>
            )}
          </div>
          
          {actionText && onActionClick && (
            <motion.button
              whileHover={{ x: 3 }}
              onClick={onActionClick}
              className={`text-sm flex items-center gap-1 ${colorClasses.text} font-medium hover:underline`}
            >
              {actionText}
              <ChevronRight size={16} />
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}