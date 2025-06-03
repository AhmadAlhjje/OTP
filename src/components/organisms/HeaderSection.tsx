"use client";

import React from "react";
import { Bot, Zap } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface HeaderSectionProps {
  title?: string;
  description?: string;
  itemCount?: number;
  itemLabel?: string;
  icon?: React.ReactNode;
  statusIcon?: React.ReactNode;
}

export const HeaderSection = ({
  title = "auto_replies",        // ← سنصبح تستخدم القيم من الترجمة
  description = "manage_automated_replies",
  itemCount = 0,
  itemLabel = "auto_reply",     // ← تم تحويله إلى key
  icon = <Bot />,
  statusIcon = <Zap />,
}: HeaderSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-8">
      {/* القسم الأيسر: الاسم والوصف */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* أيقونة رئيسية */}
          {icon}
          {/* تأثير ديناميكي */}
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full animate-pulse flex items-center justify-center">
            {statusIcon}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {t(title)}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t(description)}
          </p>
        </div>
      </div>

      {/* القسم الأيمن: عدد العناصر النشطة */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 px-5 py-3 rounded-xl shadow-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {itemCount ? t("active") : t("no_items_found")}
            </span>
            {itemCount !== undefined && (
              <>
                <span className="font-bold">
                  {itemCount} {t(itemLabel)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};