"use client";

import React, { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Tag } from "lucide-react";

interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  keywords,
  onChange,
  placeholder = "أدخل الكلمات المفتاحية...",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addKeyword = useCallback(
    (keyword: string) => {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
        onChange([...keywords, trimmedKeyword]);
        setInputValue("");
      }
    },
    [keywords, onChange]
  );

  const removeKeyword = useCallback(
    (indexToRemove: number) => {
      onChange(keywords.filter((_, index) => index !== indexToRemove));
    },
    [keywords, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(inputValue);
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      removeKeyword(keywords.length - 1);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    if (inputValue.trim()) {
      addKeyword(inputValue);
    }
  };

  return (
    <div className="space-y-3 h-40">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        <Tag className="inline w-4 h-4 mr-2" />
        الكلمات المفتاحية
      </label>

      <div
        className={`
        min-h-[120px] p-3 border-2 rounded-xl transition-all duration-200
        ${
          isInputFocused
            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
        }
      `}
      >
        {/* Keywords Display */}
        <div className="flex flex-wrap gap-2 mb-3">
          <AnimatePresence>
            {keywords.map((keyword, index) => (
              <motion.div
                key={`${keyword}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <span>{keyword}</span>
                <button
                  onClick={() => removeKeyword(index)}
                  className="opacity-70 hover:opacity-100 hover:bg-white/20 rounded-full p-0.5 transition-all duration-150"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={handleInputBlur}
          placeholder={keywords.length === 0 ? placeholder : "أضف كلمة أخرى..."}
          className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
        />

        {/* Helper Text */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          اضغط Enter لإضافة كلمة جديدة
        </div>
      </div>

      {/* Keywords Count */}
      {keywords.length > 0 && (
        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          تم إضافة {keywords.length} كلمة مفتاحية
        </div>
      )}
    </div>
  );
};
