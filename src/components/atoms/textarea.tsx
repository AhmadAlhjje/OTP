'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, MessageSquare } from 'lucide-react';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  disabled?: boolean;
}

export const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  hint,
  maxLength,
  rows = 4,
  className = '',
  dir = 'auto',
  disabled = false,
}: TextareaProps) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(value.length);
  
  // تحديث عداد الأحرف عند التغيير
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    onChange(e);
  };
  
  // تأثيرات الحركة لمؤشر التركيز
  const focusRingVariants = {
    unfocused: { opacity: 0, scale: 0.95 },
    focused: { opacity: 1, scale: 1 }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {/* التسمية */}
      {label && (
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium items-center gap-2">
          {label.toLowerCase().includes('رسالة') || label.toLowerCase().includes('message') ? (
            <MessageSquare size={16} className="text-gray-500" />
          ) : null}
          <span>{label}</span>
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      {/* حاوية حقل النص */}
      <div className="relative">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          dir={dir}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-white dark:bg-gray-800
            border ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'}
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
            transition-colors duration-200
            resize-y
            ${disabled ? 'bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed' : ''}
          `}
        />

        {/* رسالة الخطأ */}
        {error && (
          <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        )}

        {/* تلميح المساعدة */}
        {!error && hint && (
          <div className="absolute -bottom-6 left-0 text-gray-500 dark:text-gray-400 text-xs">
            {hint}
          </div>
        )}

        {/* عداد الأحرف */}
        {maxLength && (
          <div className={`absolute bottom-2 right-2 text-xs 
            ${charCount > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
            {charCount}/{maxLength}
          </div>
        )}

        {/* حلقة التركيز المتحركة */}
        <motion.div
          initial="unfocused"
          animate={focused ? "focused" : "unfocused"}
          variants={focusRingVariants}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-lg ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900 pointer-events-none"
        />
      </div>
    </div>
  );
};