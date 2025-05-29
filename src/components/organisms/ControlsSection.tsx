/**
 * قسم التحكم العلوي - يحتوي على شريط البحث وزر إضافة رد جديد
 */
import React from "react";
import { Plus, Search } from "lucide-react";
import Button from "@/components/atoms/Button";
import { SearchBar } from "../molecules/SearchBar";

interface ControlsSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddReply: () => void;
}

export const ControlsSection = ({
  searchTerm,
  onSearchChange,
  onAddReply,
}: ControlsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Search Bar */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Search />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              البحث في الردود
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ابحث في الكلمات المفتاحية أو الردود
            </p>
          </div>
        </div>
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>

      {/* Add New Reply Button */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <Plus />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              إضافة رد جديد
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              أنشئ رد تلقائي جديد
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={onAddReply}
          icon={<Plus />}
          iconPosition="left"
          size="md"
        >
          إضافة رد تلقائي
        </Button>
      </div>
    </div>
  );
};
