"use client";

import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/textarea";
import Button from "@/components/atoms/Button";
import { Pencil, Trash2 } from "lucide-react";
import Card from "@/components/molecules/Card"; 
import  useTranslation  from '@/hooks/useTranslation';

type Template = {
  id: number;
  title: string;
  content: string;
};

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { t } = useTranslation();

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

  const handleEdit = (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setTitle(template.title);
      setContent(template.content);
      setTemplates(templates.filter((t) => t.id !== id)); // احذف القديم وعدل عليه
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl dark:text-white font-semibold mb-4">
       {t('messageTemplatestitle')}
      </h1>

      {/* إدخال القالب */}
      <div className="space-y-4">
        <Input
          placeholder={t('messageTemplatestemplateTitle')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder={t('messageTemplatestemplateContent')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-green-500 focus:ring-green-600"
        />
        <Button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
         {t('messageTemplatesaddButton')}
        </Button>
      </div>

      {/* عرض القوالب بشكل كاردات */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            title={template.title}
            content={template.content}
            color="green-600"
            onEdit={() => handleEdit(template.id)}
            onDelete={() => handleDelete(template.id)}
          />
        ))}
      </div>
    </div>
  );
}
