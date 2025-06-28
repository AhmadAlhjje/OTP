"use client";

import React, { useState } from "react";
import { X, Plus, MessageSquare, Save, Trash2, Zap } from "lucide-react";
import { KeywordInput } from "./KeywordInput";
import { ReplyGroup } from "@/types/auto-reply";

interface ModalFormProps {
  isEditing: boolean;
  formData: ReplyGroup[];
  setFormData: (data: ReplyGroup[]) => void;
  onSave: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export const ModalForm: React.FC<ModalFormProps> = ({
  isEditing,
  formData,
  setFormData,
  onSave,
  onClose,
  isLoading,
}) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const updateFormData = (
    index: number,
    field: keyof ReplyGroup,
    value: any
  ) => {
    const newFormData = [...formData];
    newFormData[index] = { ...newFormData[index], [field]: value };
    setFormData(newFormData);
  };

  const addNewGroup = () => {
    setFormData([...formData, { keywords: [], response: "" }]);
    setCurrentGroupIndex(formData.length);
  };

  const removeGroup = (index: number) => {
    if (formData.length > 1) {
      const newFormData = formData.filter((_, i) => i !== index);
      setFormData(newFormData);
      setCurrentGroupIndex(Math.max(0, currentGroupIndex - 1));
    }
  };

  const currentGroup = formData[currentGroupIndex] || {
    keywords: [],
    response: "",
  };

  const isFormValid = () => {
    return formData.some(
      (group) => group.keywords.length > 0 && group.response.trim() !== ""
    );
  };

  return (
    <div className="max-h-[70vh] flex flex-col mt-10">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {isEditing ? "تعديل الرد التلقائي" : "إضافة رد تلقائي جديد"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                أنشئ ردود تلقائية ذكية لرسائل العملاء
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tabs for Multiple Groups */}
      {formData.length > 1 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 overflow-x-auto">
            {formData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentGroupIndex(index)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    currentGroupIndex === index
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  }
                `}
              >
                المجموعة {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Keywords Input */}
        <KeywordInput
          keywords={currentGroup.keywords}
          onChange={(keywords) =>
            updateFormData(currentGroupIndex, "keywords", keywords)
          }
          placeholder="مثال: مرحبا، أهلا، السلام عليكم..."
        />

        {/* Response Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <MessageSquare className="inline w-4 h-4 mr-2" />
            نص الرد التلقائي
          </label>
          <textarea
            value={currentGroup.response}
            onChange={(e) =>
              updateFormData(currentGroupIndex, "response", e.target.value)
            }
            placeholder="اكتب الرد الذي سيتم إرساله تلقائياً عند استقبال إحدى الكلمات المفتاحية..."
            rows={6}
            className="w-full h-20 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none transition-all duration-200"
          />
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>عدد الأحرف: {currentGroup.response.length}</span>
            <span>
              عدد الكلمات:{" "}
              {currentGroup.response.trim()
                ? currentGroup.response.trim().split(/\s+/).length
                : 0}
            </span>
          </div>
        </div>

        {/* Group Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={addNewGroup}
            className="flex items-center gap-2 px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200"
          >
            <Plus size={16} />
            إضافة مجموعة جديدة
          </button>

          {formData.length > 1 && (
            <button
              onClick={() => removeGroup(currentGroupIndex)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
            >
              <Trash2 size={16} />
              حذف المجموعة
            </button>
          )}
        </div>

        {/* Form Validation Info */}
        {!isFormValid() && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              يجب إضافة كلمة مفتاحية واحدة على الأقل ونص الرد لكل مجموعة
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-all duration-200"
          >
            إلغاء
          </button>
          <button
            onClick={onSave}
            disabled={isLoading || !isFormValid()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditing ? "تحديث" : "حفظ"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
