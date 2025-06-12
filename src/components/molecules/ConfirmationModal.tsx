// ConfirmationModal.tsx
"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import useTranslation from "@/hooks/useTranslation";

interface ConfirmationModalProps {
  showConfirmation: boolean;
  itemToDelete: {
    type: "template" | "person";
    id: number;
    templateId?: number;
  } | null;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  showConfirmation,
  itemToDelete,
  confirmDelete,
  cancelDelete,
}) => {
  const { t } = useTranslation();

  if (!showConfirmation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t("confirm_deletion")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {itemToDelete?.type === "template"
            ? `${t("delete_template_confirmation")}`
            : `${t("delete_person_confirmation")}`}
        </p>
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button
            onClick={cancelDelete}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {t("messageTemplatesdelete")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;