// molecules/MessageEditor.tsx
import React, { useRef } from "react";
import { Textarea } from "@/components/atoms/textarea";
import TemplateSelector from "./TemplateSelector";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

// Icons from lucide-react
import IconWrapper from "@/components/atoms/IconWrapper";
import { MessageSquare, FileText, Loader2, ImagePlus, X, Image } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface MessageEditorProps {
  message: string;
  setMessage: (msg: string) => void;
  isTemplateMode: boolean;
  setIsTemplateMode: (val: boolean) => void;
  selectedTemplate: any;
  templates: any[];
  setTemplates: (t: any[]) => void;
  setSelectedTemplate: (t: any) => void;
  templatesLoading: boolean;
  setShowTemplateDropdown: (val: boolean) => void;
  handleTemplateSelect: (template: any) => void;

  // ✅ تعديل props ليشمل صورة أو فيديو
  selectedMedia?: File | null;
  onMediaSelect?: (file: File | null) => void;
}

const MessageEditor: React.FC<MessageEditorProps> = ({
  message,
  setMessage,
  isTemplateMode,
  setIsTemplateMode,
  selectedTemplate,
  templates,
  templatesLoading,
  setSelectedTemplate,
  setShowTemplateDropdown,
  handleTemplateSelect,

  // ✅ Media props
  selectedMedia,
  onMediaSelect,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTemplateMode = () => {
    setIsTemplateMode(!isTemplateMode);
    if (!isTemplateMode) {
      setMessage("");
      setSelectedTemplate(null);
      onMediaSelect?.(null);
    } else {
      setSelectedTemplate(null);
      onMediaSelect?.(null);
    }
  };

  // ✅ دالة اختيار الملف (صورة أو فيديو)
  const handleMediaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // تحقق من نوع الملف: صورة أو فيديو فقط
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        // تحقق من الحجم (مثلاً أقل من 10MB)
        if (file.size <= 10 * 1024 * 1024) {
          onMediaSelect?.(file);
        } else {
          alert("حجم الملف كبير جداً. الحد الأقصى 10MB");
        }
      } else {
        alert("يرجى اختيار ملف صورة أو فيديو صالح");
      }
    }

    // إعادة تعيين قيمة input لاختيار نفس الملف مرة أخرى
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ حذف الملف
  const handleRemoveMedia = () => {
    onMediaSelect?.(null);
  };

  // فتح منتقي الملفات
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl transition-all duration-300 ${
              isTemplateMode
                ? "bg-purple-100 dark:bg-purple-900/30"
                : "bg-blue-100 dark:bg-blue-900/30"
            }`}
          >
            <IconWrapper
              icon={MessageSquare}
              size={20}
              color={isTemplateMode ? "#8B5CF6" : "#3B82F6"}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              {t("message_content")}
              {templatesLoading && isTemplateMode && (
                <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isTemplateMode
                ? templatesLoading
                  ? t("loading_templates")
                  : t("select_template")
                : t("write_your_message")}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isTemplateMode}
            onChange={toggleTemplateMode}
            disabled={templatesLoading}
            className="sr-only"
          />
          <div
            className={`relative w-14 h-7 transition-all duration-300 rounded-full ${
              templatesLoading ? "opacity-50 cursor-not-allowed" : ""
            } ${
              isTemplateMode
                ? "bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
              style={{
                transform: isTemplateMode ? "translateX(28px)" : "translateX(0)",
              }}
            >
              {templatesLoading && isTemplateMode ? (
                <Loader2 size={10} className="animate-spin text-purple-600" />
              ) : (
                <IconWrapper
                  icon={FileText}
                  size={12}
                  color={isTemplateMode ? "#8B5CF6" : "#6B7280"}
                />
              )}
            </div>
          </div>
        </label>
      </div>

      {/* ✅ قسم اختيار ملف (صورة أو فيديو) */}
      {!isTemplateMode && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconWrapper icon={Image} size={18} color="#10B981" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                إرفاق صورة أو فيديو (اختياري)
              </span>
            </div>

            {!selectedMedia && (
              <button
                onClick={openFileSelector}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-700 transition-all duration-200"
              >
                <IconWrapper icon={ImagePlus} size={16} color="#10B981" />
                <span className="text-sm font-medium">اختيار ملف</span>
              </button>
            )}
          </div>

          {/* عرض الملف المختار */}
          {selectedMedia && (
            <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-dashed border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center overflow-hidden">
                    {selectedMedia.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(selectedMedia)}
                        alt="معاينة الملف"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : selectedMedia.type.startsWith("video/") ? (
                      <video
                        src={URL.createObjectURL(selectedMedia)}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {selectedMedia.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  onClick={handleRemoveMedia}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="حذف الملف"
                >
                  <IconWrapper icon={X} size={16} color="#EF4444" />
                </button>
              </div>

              {/* زر تغيير الملف */}
              <button
                onClick={openFileSelector}
                className="mt-3 w-full py-2 px-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700 transition-all duration-200"
              >
                تغيير الملف
              </button>
            </div>
          )}

          {/* Input مخفي لاختيار الملفات */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* محتوى الرسالة */}
      <div className="relative">
        {isTemplateMode ? (
          <div className="space-y-4">
            {templatesLoading ? (
              // شاشة التحميل للقوالب
              <div className="border-2 border-dashed border-purple-200 dark:border-purple-700 rounded-xl p-8 text-center bg-purple-50/50 dark:bg-purple-900/10">
                <LoadingSpinner
                  size="md"
                  color="green"
                  message="جاري تحميل القوالب المتاحة..."
                  overlay={false}
                  pulse={true}
                />

                {/* skeleton للقوالب */}
                <div className="mt-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-1/2 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                message={message}
                setMessage={setMessage}
                loading={templatesLoading}
              />
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedMedia
                  ? "اكتب رسالتك هنا (أو اتركها فارغة لإرسال الملف فقط)"
                  : t("write_your_message_placeholder")
              }
              className="min-h-[180px] resize-none border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl text-base leading-relaxed transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              disabled={templatesLoading}
            />

            {/* معلومات إضافية عن الرسالة */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <span
                  className={`transition-colors ${
                    message.length > 1000
                      ? "text-orange-500"
                      : message.length > 500
                      ? "text-yellow-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {message.length} {t("characters")}
                </span>

                {message.length > 0 && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    ~{Math.ceil(message.length / 160)} رسالة
                  </span>
                )}

                {selectedMedia && (
                  <span className="text-xs bg-green-100 dark:bg-green-700 text-green-600 dark:text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                    <IconWrapper icon={Image} size={12} color="#10B981" />
                    ملف مرفق
                  </span>
                )}
              </div>

              {(message.length > 0 || selectedMedia) && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                    {t("ready_to_send")}
                  </span>
                </div>
              )}
            </div>

            {/* تحذيرات */}
            {message.length > 1000 && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg text-sm text-orange-700 dark:text-orange-300">
                <div className="w-1 h-4 bg-orange-400 rounded-full"></div>
                <span>الرسالة طويلة جداً، قد تحتاج لتقسيمها لعدة رسائل</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageEditor;
