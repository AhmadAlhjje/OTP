"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import useTranslation from "@/hooks/useTranslation";

type MessageTemplateConfirmModalProps = {
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  templateToDelete: number | null;
  handleDelete: (id: number) => void;
};

export default function MessageTemplateConfirmModal({
  showConfirmation,
  setShowConfirmation,
  templateToDelete,
  handleDelete,
}: MessageTemplateConfirmModalProps) {
  const { t } = useTranslation();

  if (!showConfirmation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t("messageTemplatesconfirmDelete")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t("messageTemplatesdeleteWarning")}
        </p>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button
            onClick={() => setShowConfirmation(false)}
            className="bg-green-600 hover:bg-green-700 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
          >
            {t("messageTemplatescancel")}
          </Button>
          <Button
            onClick={() => {
              if (templateToDelete) handleDelete(templateToDelete);
              setShowConfirmation(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {t("messageTemplatesconfirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}