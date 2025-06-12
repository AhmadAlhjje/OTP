"use client";

import React from "react";
import Input from "@/components/atoms/Input";
import { Search } from "lucide-react";

type MessageTemplatesSearchStatsProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalTemplates: number;
};

export default function MessageTemplatesSearchStats({
  searchTerm,
  setSearchTerm,
  totalTemplates,
}: MessageTemplatesSearchStatsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <Input
        type="search"
        placeholder="بحث في القوالب..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-96"
        icon={<Search className="w-5 h-5" />}
      />
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 md:mt-0">
        عدد القوالب:
        <span className="font-semibold">{totalTemplates}</span>
      </div>
    </div>
  );
}