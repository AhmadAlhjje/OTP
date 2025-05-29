/**
 * شريط البحث للردود التلقائية
 */
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="ابحث عن كلمة مفتاحية أو رد..."
        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      />
    </div>
  );
};