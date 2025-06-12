// TemplateGrid.tsx
"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import { Edit, Trash2, Copy, Save, X, Users } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import Input from "../atoms/Input";

type Person = {
  id: number;
  name: string;
  phone: string;
};

type Template = {
  id: number;
  name: string;
  people: Person[];
  createdAt: string;
  description?: string;
};

interface TemplateGridProps {
  filteredTemplates: Template[];
  editingTemplate: number | null;
  templateName: string;
  templateDescription: string;
  setTemplateName: (name: string) => void;
  setTemplateDescription: (description: string) => void;
  setEditingTemplate: (id: number | null) => void;
  handleEditTemplateName: (
    id: number,
    newName: string,
    newDescription: string
  ) => void;
  handleDeleteTemplate: (id: number) => void;
  copyTemplateData: (template: Template) => void;
  setSelectedTemplateId: (id: number) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  activeAccount: any;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  searchTerm: string;
}

const TemplateGrid: React.FC<TemplateGridProps> = ({
  filteredTemplates,
  editingTemplate,
  templateName,
  templateDescription,
  setTemplateName,
  setTemplateDescription,
  setEditingTemplate,
  handleEditTemplateName,
  handleDeleteTemplate,
  copyTemplateData,
  setSelectedTemplateId,
  showForm,
  setShowForm,
  activeAccount,
  showToast,
  searchTerm,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    {editingTemplate === template.id ? (
                      <div className="space-y-2">
                        <Input
                          value={templateName ?? template.name}
                          onChange={(e) => setTemplateName(e.target.value)}
                          className="text-lg font-semibold"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        {template.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {template.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap mr-2">
                    {template.createdAt}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>
                      {template.people.length}{" "}
                      {t("templatePeoplePagepeopleCount")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    {editingTemplate === template.id ? (
                      <>
                        <Button
                          onClick={() => {
                            handleEditTemplateName(
                              template.id,
                              templateName || template.name,
                              templateDescription || template.description || ""
                            );
                            setTemplateName("");
                            setTemplateDescription("");
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-800 p-1"
                        >
                          <Save size={16} />
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingTemplate(null);
                            setTemplateName("");
                            setTemplateDescription("");
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800 p-1"
                        >
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setEditingTemplate(template.id);
                            setTemplateName(template.name);
                            setTemplateDescription(
                              template.description || ""
                            );
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title={t("messageTemplateseditTemplate")}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTemplate(template.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 p-1"
                          title={t("templatePeoplePagedeleteTemplate")}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      onClick={() => copyTemplateData(template)}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-800 text-xs"
                      title={t("copy_data")}
                    >
                      <Copy size={14} className="mr-1" />
                      {t("messageTemplatescopy")}
                    </Button>
                    <Button
                      onClick={() => setSelectedTemplateId(template.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                    >
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            {searchTerm
              ? `${t("no_search_results")}`
              : `${t("templatePeoplePagenoTemplates")}`}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? `${t("try_different_keywords")}`
              : `${t("start_by_creating_new_template")}`}
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("templatePeoplePagecreateYourFirst")}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TemplateGrid;