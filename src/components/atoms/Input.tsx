'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  disabled?: boolean;
}

export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onKeyPress,
  required = false,
  error,
  hint,
  icon,
  className = '',
  dir = 'auto',
  disabled = false,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // تحديد نوع الإدخال الفعلي عند تبديل عرض كلمة المرور
  const actualType = type === 'password' && showPassword ? 'text' : type;
  
  // تأثيرات الحركة لمؤشر التركيز
  const focusRingVariants = {
    unfocused: { opacity: 0, scale: 0.95 },
    focused: { opacity: 1, scale: 1 }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {/* التسمية */}
      {label && (
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium items-center">
          <span>{label}</span>
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      {/* حاوية حقل الإدخال */}
      <div className="relative group">
        {/* أيقونة البداية (اختيارية) */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}

        {/* حقل الإدخال الرئيسي */}
        <input
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          dir={dir}
          className={`
            w-full px-4 py-2.5 rounded-lg
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            bg-white dark:bg-gray-800
            border ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'}
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
            transition-colors duration-200
            ${disabled ? 'bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed' : ''}
          `}
        />

        {/* أيقونة عرض/إخفاء كلمة المرور */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <EyeOff size={18} className="transition-opacity" />
            ) : (
              <Eye size={18} className="transition-opacity" />
            )}
          </button>
        )}

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
}