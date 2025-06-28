import React, { useEffect, useState } from "react";
import { Plus, Edit3, X, Save, Sparkles, Minus } from "lucide-react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Textarea } from "../atoms/textarea";
import useTranslation from "@/hooks/useTranslation";

interface ReplyGroup {
  keywords: string[];
  response: string;
}

interface ModalFormProps {
  isEditing: boolean;
  formData: ReplyGroup[];  // أصبح مصفوفة
  setFormData: (data: ReplyGroup[]) => void;
  onSave: () => void;
  onClose: () => void;
  isLoading: boolean;
  errors?: {
    keywords?: string;
    response?: string;
    scheduledAt?: string;
  };
}

export const ModalForm = ({
  isEditing,
  formData,
  setFormData,
  onSave,
  onClose,
  isLoading,
}: ModalFormProps) => {
  const { t } = useTranslation();

  // لإضافة مجموعة جديدة فارغة
  const addReplyGroup = () => {
    setFormData([...formData, { keywords: [], response: "" }]);
  };

  // لحذف مجموعة حسب الفهرس
  const removeReplyGroup = (index: number) => {
    const updated = formData.filter((_, i) => i !== index);
    setFormData(updated);
  };

  // لتحديث كلمات أو رد في مجموعة معينة
  const updateReplyGroup = (
    index: number,
    field: "keywords" | "response",
    value: string | string[]
  ) => {
    const updated = formData.map((group, i) =>
      i === index ? { ...group, [field]: value } : group
    );
    setFormData(updated);
  };

  return (
    <>
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              {isEditing ? <Edit3 /> : <Plus />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {isEditing
                  ? `${t("modal_title_edit")}`
                  : `${t("modal_title_add")}`}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isEditing
                  ? `${t("modal_subtitle_edit")}`
                  : `${t("modal_subtitle_add")}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
        {formData.map((group, index) => {
          const keywordInput = group.keywords.join(", ");
          return (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 relative"
            >
              {/* زر حذف يظهر فقط إذا أكثر من مجموعة */}
              {formData.length > 1 && (
                <button
                  onClick={() => removeReplyGroup(index)}
                  className="absolute top-2 left-2 text-red-500 hover:text-red-700"
                  title={t("remove_reply_group")}
                >
                  <Minus size={20} />
                </button>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("label_keywords")} *
                </label>
                <Input
                  type="text"
                  placeholder={t("hello_hi_hey")}
                  value={keywordInput}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const keywords = rawValue
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean);
                    updateReplyGroup(index, "keywords", keywords);
                  }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("helper_text_keywords")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("label_response")} *
                </label>
                <Textarea
                  value={group.response}
                  onChange={(e) =>
                    updateReplyGroup(index, "response", e.target.value)
                  }
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("helper_text_response")}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {group.response.length} {t("character_count")}
                  </span>
                </div>
              </div>

              {group.keywords.length > 0 && group.response && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-xl border border-green-200 dark:border-green-700 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {t("preview_title")}
                    </span>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>{t("preview_received")} :</strong>{" "}
                      {group.keywords.map((k) => `"${k}"`).join(", ") || "---"}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      <strong>{t("preview_reply")} :</strong> {group.response}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* زر إضافة مجموعة جديدة */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={addReplyGroup}
            className="flex items-center gap-2"
          >
            <Plus />
            <span>{t("add_new_reply_group")}</span>
          </Button>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
        <Button variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          disabled={
            // تعطيل الزر إذا كل المجموعات فارغة أو غير مكتملة
            formData.every(
              (group) =>
                group.keywords.length === 0 || !group.response.trim()
            ) || isLoading
          }
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>{t("saving_changes")}...</span>
            </>
          ) : (
            <>
              <Save />
              <span>{isEditing ? t("button_update") : t("button_save")}</span>
            </>
          )}
        </Button>
      </div>
    </>
  );
};
