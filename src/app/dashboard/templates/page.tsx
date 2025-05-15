"use client";

import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/textarea";
import Button from "@/components/atoms/Button";
import { Pencil, Trash2 } from "lucide-react";

type Template = {
  id: number;
  title: string;
  content: string;
};

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAdd = () => {
    if (title && content) {
      setTemplates([{ id: Date.now(), title, content }, ...templates]);
      setTitle("");
      setContent("");
    }
  };

  const handleDelete = (id: number) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl dark:text-white font-semibold mb-4">
        قوالب الرسائل
      </h1>

      <div className="space-y-4">
        <Input
          placeholder="عنوان القالب"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="محتوى القالب"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-green-500 focus:ring-green-600"
        />
        <Button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          إضافة قالب
        </Button>
      </div>

      <div className="pt-6 space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white border border-green-600 rounded-xl p-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-green-700">
                {template.title}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="success"
                  className="text-green-600 border-green-600"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="success"
                  className="text-red-600 border-red-600"
                  onClick={() => handleDelete(template.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <p className="text-gray-700">{template.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
