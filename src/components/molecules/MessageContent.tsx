import { Eye } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface MessageContentProps {
  message: string;
  onShowFullMessage: () => void;
}

export const MessageContent = ({
  message,
  onShowFullMessage,
}: MessageContentProps) => {
  const { t } = useTranslation();

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-800 dark:text-gray-200">
        {truncateMessage(message)}
      </span>
      {message.length > 50 && (
        <button
          onClick={onShowFullMessage}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
          title={t("view_full_message")}
        >
          <Eye className="w-3 h-3" />
          {t("show_full")}
        </button>
      )}
    </div>
  );
};