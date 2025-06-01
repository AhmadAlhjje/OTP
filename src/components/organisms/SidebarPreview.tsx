// organisms/SidebarPreview.tsx
// عرض المعلومات الثانوية مثل قائمة الأرقام والرسالة ومعلومات الإرسال

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface SidebarPreviewProps {
  recipientNumbers: string[];
  message: string;
  isScheduled: boolean;
  isTemplateMode: boolean;
  selectedTemplate: any;
}

const SidebarPreview: React.FC<SidebarPreviewProps> = ({
  recipientNumbers,
  message,
  isScheduled,
  isTemplateMode,
  selectedTemplate,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Phone size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">
              {t("recipient_list")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("added_numbers_for_sending")}
            </p>
          </div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {recipientNumbers.length > 0 ? t("numbers_added") : t("no_numbers")}
        </span>
      </div>

      {recipientNumbers.length > 0 ? (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {recipientNumbers.map((number, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Phone
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {number}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("number")} {index + 1}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
          <Phone
            size={64}
            strokeWidth={1}
            className="text-gray-300 dark:text-gray-600"
          />
          <p className="mt-4 text-lg font-medium">{t("no_numbers_added")}</p>
          <p className="text-sm text-center leading-relaxed mt-2">
            {t("add_recipient_numbers_to_start")}
            <br />
            {t("can_add_multiple_numbers")}
          </p>
        </div>
      )}

      {(isTemplateMode || message.trim()) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
        >
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            {t("send_preview")}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                {t("message_type")}:{" "}
                {isTemplateMode
                  ? t("predefined_template")
                  : t("custom_message")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                {t("number_of_recipients")}: {recipientNumbers.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                {t("send_time")}:{" "}
                {isScheduled ? t("scheduled") : t("immediate")}
              </span>
            </div>
            {isTemplateMode && selectedTemplate && (
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {t("template_id")}: {selectedTemplate.id}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SidebarPreview;
