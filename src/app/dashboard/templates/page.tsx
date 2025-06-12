"use client";
import React, { useState, useEffect } from "react";
import { getActiveAccount } from "@/services/my_accounts";
import useTranslation from "@/hooks/useTranslation";

// Import API functions
import {
  saveTemplateToAPI,
  updateTemplateToAPI,
  fetchTemplatesFromAPI,
  deleteTemplateFromAPI,
} from "@/services/templateMassageService";
import { useToast } from "@/hooks/useToast";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import MessageTemplatesHeader from "@/components/molecules/MessageTemplatesHeader";
import MessageTemplateForm from "@/components/molecules/MessageTemplateForm";
import MessageTemplatesSearchStats from "@/components/molecules/MessageTemplatesSearchStats";
import MessageTemplateConfirmModal from "@/components/molecules/MessageTemplateConfirmModal";
import MessageTemplatesGrid from "@/components/molecules/MessageTemplatesGrid";

// Template Type with new fields
export type Template = {
  _id?: string;
  id: number;
  name: string;
  content: string;
  createdAt: string;
  type: string;
  tags: string[];
};

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState(""); // Optional
  const [tags, setTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  const { t } = useTranslation();
  const [activeAccount, setActiveAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Load templates from API
  useEffect(() => {
    const loadTemplatesAndAccount = async () => {
      try {
        // جلب القوالب
        const apiTemplates = await fetchTemplatesFromAPI();
        const localTemplates = apiTemplates.map((t) => ({
          _id: t._id,
          id: parseInt(t._id.slice(-6), 16),
          name: t.name,
          content: t.content || "",
          createdAt: new Date(t.created_at).toLocaleDateString("ar-SA"),
          type: t.type || "",
          tags: t.tags || [],
        }));
        setTemplates(localTemplates);

        // جلب الحساب النشط
        const account = await getActiveAccount();
        if (account?.id) {
          setActiveAccount(account);
        }
      } catch (error) {
        console.error("فشل تحميل البيانات");
      }
    };

    if (templates.length === 0) {
      loadTemplatesAndAccount();
    }
  }, []);

  const handleAdd = async () => {
    if (!activeAccount) {
      showToast(t("select_whatsapp_account_first"), "error");
      return;
    }
    if (!name || !content) return;

    setIsLoading(true); // <-- بدء التحميل

    const templateData = {
      name,
      content,
      type: type || "",
      tags: tags.length > 0 ? tags : [],
    };

    try {
      if (isEditing && editingId) {
        const templateToUpdate = templates.find((t) => t.id === editingId);
        if (templateToUpdate?._id) {
          await updateTemplateToAPI(templateToUpdate._id, {
            name,
            content,
          });
        }
        setTemplates(
          templates.map((t) =>
            t.id === editingId ? { ...t, name, content, type, tags } : t
          )
        );
      } else {
        await saveTemplateToAPI({
          name,
          content,
        });
        const newTemplate = {
          id: Date.now(),
          name,
          content,
          createdAt: new Date().toLocaleDateString("ar-SA"),
          type: type || "",
          tags: tags.length > 0 ? tags : [],
        };
        setTemplates([newTemplate, ...templates]);
      }

      setName("");
      setContent("");
      setType("");
      setTags([]);
      setIsEditing(false);
      setEditingId(null);
      setShowForm(false);

      showToast(t("messageTemplatessavedSuccessfully"), "success");
    } catch (error) {
      console.error("فشل في حفظ أو تحديث القالب");
      showToast(t("messageTemplatesaveFailed"), "error");
    } finally {
      setIsLoading(false); // <-- انتهاء التحميل
    }
  };

  const handleEdit = (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setName(template.name);
      setContent(template.content);
      setType(template.type);
      setTags(template.tags);
      setIsEditing(true);
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (!template) return;

    setIsLoading(true); // <-- بدء التحميل

    if (template?._id) {
      try {
        const success = await deleteTemplateFromAPI(template._id);
        if (success) {
          setTemplates(templates.filter((t) => t.id !== id));
          showToast(t("messageTemplatedeletedSuccessfully"), "success");
        }
      } catch (e) {
        console.error("فشل في حذف القالب");
        showToast(t("messageTemplatedeleteFailed"), "error");
      }
    } else {
      setTemplates(templates.filter((t) => t.id !== id));
      showToast(t("messageTemplatedeletedSuccessfully"), "success");
    }

    setIsLoading(false); // <-- انتهاء التحميل
  };

  const resetForm = () => {
    setName("");
    setContent("");
    setType("");
    setTags([]);
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  // We removed filtering based on search term
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-blue-gray min-h-screen pb-10">
      {/* Header Section */}
      <MessageTemplatesHeader
        activeAccount={activeAccount}
        showForm={showForm}
        setShowForm={setShowForm}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Form Section - Appears when "Add New" is clicked */}
        {showForm && (
          <MessageTemplateForm
            isEditing={isEditing}
            name={name}
            content={content}
            setName={setName}
            setContent={setContent}
            resetForm={resetForm}
            handleAdd={handleAdd}
          />
        )}

        {/* Search and Stats Section */}
        <MessageTemplatesSearchStats
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalTemplates={templates.length}
        />

        {/* Templates Grid */}
        <MessageTemplatesGrid
          templates={filteredTemplates}
          searchTerm={searchTerm}
          showForm={showForm}
          activeAccount={activeAccount}
          setShowForm={setShowForm}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          copyToClipboard={copyToClipboard}
          formatDate={formatDate}
        />
      </div>

      {/* Confirmation Modal */}
      <MessageTemplateConfirmModal
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        templateToDelete={templateToDelete}
        handleDelete={handleDelete}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner message={t("preparing")} size="md" color="green" />
        </div>
      )}
    </div>
  );
}
