/**
 * قائمة الردود التلقائية مع الفلترة حسب البحث
 * يمكن تخصيص النصوص والعنوان من خلال props
 */
import React from "react";
import { ReplyCard } from "@/components/molecules/ReplyCard";
import { AutoReply } from "@/types/auto-reply";
import useTranslation from "@/hooks/useTranslation";

interface RepliesListProps {
  replies: AutoReply[];
  searchTerm: string;
  onEdit: (reply: AutoReply) => void;
  onDelete: (id: string) => void;

  // 👇 الخصائص الديناميكية الجديدة
  title?: string;
  emptySearchText?: string;
  emptyDefaultText?: string;
  emptySearchSuggestion?: string;
  emptyDefaultActionText?: string;
}

export const RepliesList = ({
  replies,
  searchTerm,
  onEdit,
  onDelete,
  title = "auto_replies_list",
  emptySearchText = "no_search_results",
  emptyDefaultText = "no_auto_replies",
  emptySearchSuggestion = "try_different_keywords",
  emptyDefaultActionText = "add_auto_replies_to_start",
}: RepliesListProps) => {
  const { t } = useTranslation();

  const filteredReplies = replies.filter(
    (reply) =>
      reply.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reply.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">
              {t(title)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredReplies.length} {t("of")} {replies.length} {t("auto_reply")}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {filteredReplies.length > 0 ? (
          <div className="space-y-4">
            {filteredReplies.map((reply) => (
              <ReplyCard
                key={reply._id}
                reply={reply}
                onEdit={() => onEdit(reply)}
                onDelete={() => onDelete(reply._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="animate-pulse h-10 w-10 border-b-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
            <p className="mt-4 text-lg font-medium">
              {searchTerm ? t(emptySearchText) : t(emptyDefaultText)}
            </p>
            <p className="text-sm text-center leading-relaxed mt-2">
              {searchTerm ? t(emptySearchSuggestion) : t(emptyDefaultActionText)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};