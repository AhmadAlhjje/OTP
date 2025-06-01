// organisms/SidebarPreview.tsx
// عرض المعلومات الثانوية مثل قائمة الأرقام والرسالة ومعلومات الإرسال

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

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
              قائمة المستقبلين
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              الأرقام المضافة للإرسال
            </p>
          </div>
        </div>
        <span className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 text-indigo-800 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
          {recipientNumbers.length} رقم
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
                  <Phone size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {number}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    رقم {index + 1}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
          <Phone size={64} strokeWidth={1} className="text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-lg font-medium">لا توجد أرقام مضافة</p>
          <p className="text-sm text-center leading-relaxed mt-2">
            أضف أرقام المستقبلين لبدء الإرسال
            <br />
            يمكنك إضافة عدة أرقام للإرسال الجماعي
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
            معاينة الإرسال
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                نوع الرسالة: {isTemplateMode ? "قالب جاهز" : "رسالة مخصصة"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                عدد المستقبلين: {recipientNumbers.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                وقت الإرسال: {isScheduled ? "مجدول" : "فوري"}
              </span>
            </div>
            {isTemplateMode && selectedTemplate && (
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span className="text-gray-700 dark:text-gray-300">
                  معرف القالب: {selectedTemplate.id}
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