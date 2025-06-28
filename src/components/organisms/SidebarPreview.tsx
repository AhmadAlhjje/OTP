// organisms/SidebarPreview.tsx
import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Clock, FileText, Image, CheckCircle } from "lucide-react";
import IconWrapper from "@/components/atoms/IconWrapper";
import useTranslation from "@/hooks/useTranslation";

interface SidebarPreviewProps {
  recipientNumbers: string[];
  message: string;
  isScheduled: boolean;
  isTemplateMode: boolean;
  selectedTemplate: any;
  selectedMedia?: File | null;  // ✅ استقبال صورة أو فيديو
}

const SidebarPreview: React.FC<SidebarPreviewProps> = ({
  recipientNumbers,
  message,
  isScheduled,
  isTemplateMode,
  selectedTemplate,
  selectedMedia,  // ✅ استقبال الصورة أو الفيديو
}) => {
  const { t } = useTranslation();

  // حساب عدد المستلمين الإجمالي
  const totalRecipients = recipientNumbers.length;

  // الرسالة للعرض (النص)
  const displayMessage = isTemplateMode && selectedTemplate
    ? selectedTemplate.content
    : message;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* عنوان المعاينة */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <IconWrapper icon={MessageSquare} size={20} color="#3B82F6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
              معاينة الرسالة
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isScheduled ? "رسالة مجدولة" : "رسالة فورية"}
            </p>
          </div>
        </div>

        {/* معلومات المستلمين */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <IconWrapper icon={Users} size={16} color="#10B981" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              عدد المستلمين:
            </span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {totalRecipients}
            </span>
          </div>

          {isScheduled && (
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <IconWrapper icon={Clock} size={16} color="#F59E0B" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                مجدولة
              </span>
            </div>
          )}

          {isTemplateMode && selectedTemplate && (
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <IconWrapper icon={FileText} size={16} color="#8B5CF6" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                قالب: {selectedTemplate.name || "قالب محدد"}
              </span>
            </div>
          )}

          {/* ✅ عرض معلومات الملف (صورة أو فيديو) */}
          {selectedMedia && (
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <IconWrapper icon={Image} size={16} color="#10B981" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedMedia.type.startsWith("image/") ? "صورة مرفقة:" : "فيديو مرفق:"} {selectedMedia.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({(selectedMedia.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* معاينة محتوى الرسالة */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <IconWrapper icon={MessageSquare} size={16} color="#6B7280" />
            معاينة المحتوى
          </h4>
        </div>

        <div className="p-6 space-y-4">
          {/* ✅ معاينة الصورة أو الفيديو */}
          {selectedMedia && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <IconWrapper icon={Image} size={14} color="#10B981" />
                {selectedMedia.type.startsWith("image/") ? "الصورة المرفقة:" : "الفيديو المرفق:"}
              </div>
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-3 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                    {selectedMedia.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(selectedMedia)}
                        alt="معاينة الملف"
                        className="w-full h-full object-cover"
                      />
                    ) : selectedMedia.type.startsWith("video/") ? (
                      <video
                        src={URL.createObjectURL(selectedMedia)}
                        controls
                        className="w-full h-full"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {selectedMedia.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedMedia.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <IconWrapper icon={CheckCircle} size={14} color="#10B981" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* معاينة النص */}
          {displayMessage && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isTemplateMode ? "نص القالب:" : "نص الرسالة:"}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {displayMessage || "لا يوجد محتوى نصي"}
                </p>
              </div>

              {/* معلومات إضافية عن النص */}
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{displayMessage.length} حرف</span>
                <span>~{Math.ceil(displayMessage.length / 160)} رسالة SMS</span>
              </div>
            </div>
          )}

          {/* رسالة في حالة عدم وجود محتوى */}
          {!displayMessage && !selectedMedia && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <IconWrapper icon={MessageSquare} size={24} color="#9CA3AF" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                لا يوجد محتوى للمعاينة
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                اكتب رسالة أو اختر ملف صورة أو فيديو لرؤية المعاينة
              </p>
            </div>
          )}
        </div>
      </div>

      {/* قائمة المستلمين */}
      {totalRecipients > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <IconWrapper icon={Users} size={16} color="#6B7280" />
              المستلمون ({totalRecipients})
            </h4>
          </div>

          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {recipientNumbers.map((number, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* حالة الاستعداد للإرسال */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
          (displayMessage || selectedMedia) && totalRecipients > 0
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            (displayMessage || selectedMedia) && totalRecipients > 0
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-gray-100 dark:bg-gray-700"
          }`}>
            <IconWrapper
              icon={CheckCircle}
              size={16}
              color={(displayMessage || selectedMedia) && totalRecipients > 0 ? "#10B981" : "#9CA3AF"}
            />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              (displayMessage || selectedMedia) && totalRecipients > 0
                ? "text-green-700 dark:text-green-300"
                : "text-gray-500 dark:text-gray-400"
            }`}>
              {(displayMessage || selectedMedia) && totalRecipients > 0
                ? "جاهز للإرسال!"
                : "أكمل البيانات المطلوبة"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(displayMessage || selectedMedia) && totalRecipients > 0
                ? `ستصل إلى ${totalRecipients} مستلم`
                : "أضف مستلمين ومحتوى الرسالة"}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SidebarPreview;
