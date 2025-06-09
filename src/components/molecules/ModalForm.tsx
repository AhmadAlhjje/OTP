/**
 * نافذة منبثقة لإضافة أو تعديل رد تلقائي
 */
import React from "react";
import { Plus, Edit3, X, Save, Sparkles } from "lucide-react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Textarea } from "../atoms/textarea";
import useTranslation from "@/hooks/useTranslation";

interface ModalFormProps {
  isEditing: boolean;
  formData: { keyword: string; response: string };
  setFormData: (data: { keyword: string; response: string }) => void;
  onSave: () => void;
  onClose: () => void;
  isLoading: boolean;
  errors?: {
    keyword?: string;
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
                {isEditing ? `${t("modal_title_edit")}` : `${t("modal_title_add")}`}
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
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("label_keyword")} *
          </label>
          <Input
            type="text"
            value={formData.keyword}
            onChange={(e) =>
              setFormData({ ...formData, keyword: e.target.value })
            }
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t("helper_text_keyword")}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("label_response")} *
          </label>
          <Textarea
            // type="textarea"
            value={formData.response}
            onChange={(e) =>
              setFormData({ ...formData, response: e.target.value })
            }
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("helper_text_response")}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formData.response.length} {t("character_count")}
            </span>
          </div>
        </div>

        {formData.keyword && formData.response && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {t("preview_title")}
              </span>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{t("preview_received")} :</strong> "{formData.keyword}"
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                <strong>{t("preview_reply")} :</strong> {formData.response}
              </p>
            </div>
          </div>
        )}
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
            !formData.keyword.trim() || !formData.response.trim() || isLoading
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
              <span>{isEditing ? `${t("button_update")}` : `${t("button_save")}`}</span>
            </>
          )}
        </Button>
      </div>
    </>
  );
};
