// TemplateSearchAndStats.tsx
"use client";

import React from "react";
import Input from "@/components/atoms/Input";
import { Search } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface TemplateSearchAndStatsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  templates: any[]; // يمكنك استبدال `any` بنوع معروف إذا كان لديك interface للـ template
}

const TemplateSearchAndStats: React.FC<TemplateSearchAndStatsProps> = ({
  searchTerm,
  setSearchTerm,
  templates,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex-1 max-w-md">
        <Input
          type="search"
          placeholder={t("search_in_templates_and_people")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-5 h-5" />}
          className="w-full"
        />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-4">
        <span>
          {t("total_templates")} :{" "}
          <span className="font-semibold text-blue-600">
            {templates.length}
          </span>
        </span>
        <span>
          {t("total_people")}:{" "}
          <span className="font-semibold text-green-600">
            {templates.reduce((sum, t) => sum + t.people.length, 0)}
          </span>
        </span>
      </div>
    </div>
  );
};

export default TemplateSearchAndStats;