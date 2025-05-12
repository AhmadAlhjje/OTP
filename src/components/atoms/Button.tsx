'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // ✨ تم إضافته هنا
}

export default function Button({
  children,
  onClick,
  disabled,
  fullWidth = false,
  type = 'button',
  className = '', // ✨ قيمة افتراضية
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors 
        ${fullWidth ? 'w-full' : ''} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
        ${className}`} // ✨ دمج الكلاسات المخصصة
    >
      {children}
    </button>
  );
}
