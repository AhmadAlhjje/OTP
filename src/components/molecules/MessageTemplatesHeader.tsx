"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import { MessageSquare } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/useToast";

type MessageTemplatesHeaderProps = {
  activeAccount: any;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
};

export default function MessageTemplatesHeader({
  activeAccount,
  showForm,
  setShowForm,
}: MessageTemplatesHeaderProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("messageTemplatestitle")}
            </h1>
          </div>
          <Button
            onClick={() => {
              if (!activeAccount) {
                showToast(t("select_whatsapp_account_first"), "error");
                return;
              }
              setShowForm(!showForm);
            }}
            className={`flex items-center gap-2 ${
              showForm
                ? "bg-gray-200 text-gray-800"
                : "bg-green-600 hover:bg-green-700 text-white"
            } rounded-full px-4 py-2 transition-all`}
          >
            {showForm ? t("messageTemplatescancel") : t("messageTemplatesaddNew")}
          </Button>
        </div>
      </div>
    </div>
  );
}