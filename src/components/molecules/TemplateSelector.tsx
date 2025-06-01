// molecules/TemplateSelector.tsx
import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import IconWrapper from "@/components/atoms/IconWrapper";
import { ChevronDown, FileText, X } from "lucide-react";

// ✅ استيراد CheckCircle2 لأنك تستخدمه في هذا الملف
import { CheckCircle2 } from "lucide-react"; 
import useTranslation from "@/hooks/useTranslation";

interface Template {
  id: string;
  name: string;
  content: string;
  category?: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template | null) => void;
  message: string;
  setMessage: (msg: string) => void;
  loading?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  templates,
  selectedTemplate,
  setSelectedTemplate,
  message,
  setMessage,
  loading = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { t } = useTranslation();

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setMessage(template.content);
    setShowDropdown(false);
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={loading}
          className="w-full p-4 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center justify-between"
        >
          <span>
            {loading ? "جاري التحميل..." : selectedTemplate ? selectedTemplate.name : `${t("select_template")}`}
          </span>
          <IconWrapper
            icon={ChevronDown}
            size={20}
            color="#A855F7"
            className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>

        {showDropdown && !loading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
            {templates.length > 0 ? (
              templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full p-4 text-right hover:bg-purple-50 dark:hover:bg-purple-900/20 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{template.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{template.content}</p>
                    {template.category && (
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        {template.category}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">لا توجد قوالب متاحة</div>
            )}
          </div>
        )}
      </div>

      {selectedTemplate && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-purple-800 dark:text-purple-300">القالب المحدد: {selectedTemplate.name}</h4>
            <button onClick={clearTemplate}>
              <IconWrapper icon={X} size={16} color="#EF4444" />
            </button>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
            {selectedTemplate.content}
          </p>
          <div className="flex items-center gap-2 mt-3 text-purple-700 dark:text-purple-300">
            {/* ✅ استخدام CheckCircle2 بعد الاستيراد */}
            <IconWrapper icon={CheckCircle2} size={16} color="#A855F7" />
            <span className="text-sm font-medium">سيتم إرسال القالب: {selectedTemplate.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;