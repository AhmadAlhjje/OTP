"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/textarea";
import Button from "@/components/atoms/Button";
import { getActiveAccount } from "@/services/my_accounts";
import { Pencil, Trash2, Search, MessageSquare } from "lucide-react";
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
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("messageTemplatestitle")}
              </h1>
            </div>
            <Button
              onClick={() => {
                if (!activeAccount) {
                  showToast(t("select_whatsapp_account_first"), "error");
                  return;
                }
                setShowForm(!showForm);
              }}
              className={`flex items-center gap-2 ${
                showForm
                  ? "bg-gray-200 text-gray-800"
                  : "bg-green-600 hover:bg-green-700 text-white"
              } rounded-full px-4 py-2 transition-all`}
            >
              {showForm ? (
                t("messageTemplatescancel")
              ) : (
                <>{t("messageTemplatesaddNew")}</>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Form Section - Appears when "Add New" is clicked */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-all ease-in-out duration-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {isEditing
                ? t("messageTemplateseditTemplate")
                : t("messageTemplatesnewTemplate")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("messageTemplatestemplateTitle")}
                </label>
                <Input
                  placeholder={t("messageTemplatestitlePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("messageTemplatestemplateContent")}
                </label>
                <Textarea
                  placeholder={t("messageTemplatescontentPlaceholder")}
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
                  {t("messageTemplatescancel")}
                </Button>
                <Button
                  onClick={handleAdd}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!name || !content}
                >
                  {isEditing
                    ? t("messageTemplatessave")
                    : t("messageTemplatesadd")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Stats Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Input
            type="search"
            placeholder={t("messageTemplatessearch")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96"
            icon={<Search className="w-5 h-5" />}
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("messageTemplatestotalTemplates")}:{" "}
            <span className="font-semibold">{templates.length}</span>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
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
                      <Button
                        onClick={() => handleEdit(template.id)}
                        variant="ghost"
                        size="sm"
                        icon={<Pencil size={16} />}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        aria-label={t("messageTemplatesedit")}
                        title={t("messageTemplatesedit")}
                        children={undefined}
                      />
                      <Button
                        onClick={() => handleDelete(template.id)}
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={16} />}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        aria-label={t("messageTemplatesdelete")}
                        title={t("messageTemplatesdelete")}
                        children={undefined}
                      />
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
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
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
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner
            message={t("preparing")}
            size="md"
            color="green"
          />
        </div>
      )}
    </div>
  );
}
