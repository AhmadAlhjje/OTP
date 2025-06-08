import { X, MessageSquare, Eye } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface MessagePreviewModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const MessagePreviewModal = ({
  isOpen,
  message,
  onClose,
}: MessagePreviewModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] flex flex-col transform animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {t("message_content")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("view_full_message_description")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto">
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words text-right">
              {message}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{t("char_count")}: {message.length}</span>
            <span>
              {t("word_count")}:{" "}
              {
                message
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
              }
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};