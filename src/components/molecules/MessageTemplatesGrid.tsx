"use client";

import React from "react";
import Button from "@/components/atoms/Button";
// import MessageSquare from "@/components/icons/MessageSquare";
import useTranslation from "@/hooks/useTranslation";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";

type Template = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
};

type MessageTemplatesGridProps = {
  templates: Template[];
  searchTerm: string;
  showForm: boolean;
  activeAccount: any;
  setShowForm: (show: boolean) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  copyToClipboard: (content: string) => void;
  formatDate: (dateString: string) => string;
};

export default function MessageTemplatesGrid({
  templates,
  searchTerm,
  showForm,
  activeAccount,
  setShowForm,
  handleEdit,
  handleDelete,
  copyToClipboard,
  formatDate,
}: MessageTemplatesGridProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  return (
    <>
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {template.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(template.createdAt)}
                  </span>
                </div>
                <div className="h-24 overflow-hidden text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {template.content}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    {/* <Button
                      onClick={() => handleEdit(template.id)}
                      variant="ghost"
                      size="sm"
                      icon="edit"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      aria-label={t("messageTemplatesedit")}
                      title={t("messageTemplatesedit")}
                    /> */}
                    <EditButton onClick={() => handleEdit(template.id)} />
                    {/* <Button
                      onClick={() => handleDelete(template.id)}
                      variant="ghost"
                      size="sm"
                      icon="trash"
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      aria-label={t("messageTemplatesdelete")}
                      title={t("messageTemplatesdelete")}
                    /> */}
                    <DeleteButton onClick={() => handleDelete(template.id)} />
                  </div>
                  <Button
                    onClick={() => copyToClipboard(template.content)}
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1 font-medium text-sm"
                  >
                    {t("messageTemplatescopy")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            {searchTerm
              ? t("messageTemplatesnoSearchResults")
              : t("messageTemplatesnoTemplates")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? t("messageTemplatestryDifferentSearch")
              : t("messageTemplatesgetStarted")}
          </p>
          {!showForm && !searchTerm && (
            <div className="mt-6">
              <Button
                onClick={() => {
                  if (!activeAccount) {
                    showToast(t("select_whatsapp_account_first"), "error");
                    return;
                  }
                  setShowForm(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center"
              >
                {t("messageTemplatesaddFirst")}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
