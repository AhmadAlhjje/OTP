// StatusIndicator.tsx - مؤشر حالة الاتصال
import React from "react";
import useTranslation from "@/hooks/useTranslation";

interface StatusIndicatorProps {
  status: "loading" | "connected" | "disconnected";
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
        {t("status")}
      </span>
      <div className="flex items-center gap-2">
        <div
          className={`
          w-2 h-2 rounded-full transition-colors
          ${
            status === "connected"
              ? "bg-green-500 animate-pulse shadow-green-500/50 shadow-sm"
              : status === "loading"
              ? "bg-yellow-500 animate-pulse"
              : "bg-red-500"
          }
        `}
        ></div>
        <span
          className={`
          text-xs font-semibold tracking-wide
          ${
            status === "connected"
              ? "text-green-600 dark:text-green-400"
              : status === "loading"
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-red-600 dark:text-red-400"
          }
        `}
        >
          {status === "loading" && t("loading")}
          {status === "connected" && t("Connected")}
          {status === "disconnected" && t("no_account_selected")}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;