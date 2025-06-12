"use client";

import React from "react";
import Input from "@/components/atoms/Input";
import {Textarea} from "@/components/atoms/textarea";
import Button from "@/components/atoms/Button";

type MessageTemplateFormProps = {
  isEditing: boolean;
  name: string;
  content: string;
  setName: (name: string) => void;
  setContent: (content: string) => void;
  resetForm: () => void;
  handleAdd: () => void;
};

export default function MessageTemplateForm({
  isEditing,
  name,
  content,
  setName,
  setContent,
  resetForm,
  handleAdd,
}: MessageTemplateFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-all ease-in-out duration-300">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {isEditing ? "تعديل قالب" : "قالب جديد"}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            عنوان القالب
          </label>
          <Input
            placeholder="أدخل عنوان القالب"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            محتوى القالب
          </label>
          <Textarea
            placeholder="أدخل محتوى القالب"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-2">
          <Button
            onClick={resetForm}
            className="bg-green-600 hover:bg-green-700 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!name || !content}
          >
            {isEditing ? "حفظ التغييرات" : "إضافة"}
          </Button>
        </div>
      </div>
    </div>
  );
}