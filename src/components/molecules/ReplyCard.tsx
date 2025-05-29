/**
 * بطاقة تمثل ردًا تلقائيًا واحدًا
 */
import React from "react";
import { Clock } from "lucide-react";
import DeleteButton from "@/components/common/DeleteButton";
import EditButton from "@/components/common/EditButton";

interface AutoReply {
  id: number;
  keyword: string;
  response: string;
}

interface ReplyCardProps {
  reply: AutoReply;
  onEdit: () => void;
  onDelete: () => void;
}

export const ReplyCard = ({ reply, onEdit, onDelete }: ReplyCardProps) => {
  return (
    <div className="group bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {reply.keyword}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              <span>نشط</span>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {reply.response}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-100 transition-opacity ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <EditButton />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <DeleteButton />
          </button>
        </div>
      </div>
    </div>
  );
};
