// TemplateDetailsModal.tsx
"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import { Edit, Trash2, Copy, Save, X, Phone } from "lucide-react";
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

interface TemplateDetailsModalProps {
  selectedTemplate: Template | null;
  editingPerson: number | null;
  personName: string;
  personPhone: string;
  setPersonName: (name: string) => void;
  setPersonPhone: (phone: string) => void;
  setEditingPerson: (id: number | null) => void;
  handleEditPerson: (
    personId: number,
    newName: string,
    newPhone: string
  ) => void;
  handleDeletePerson: (personId: number, templateId: number) => void;
  copyTemplateData: (template: Template) => void;
  setSelectedTemplateId: (id: number | null) => void;
}

const TemplateDetailsModal: React.FC<TemplateDetailsModalProps> = ({
  selectedTemplate,
  editingPerson,
  personName,
  personPhone,
  setPersonName,
  setPersonPhone,
  setEditingPerson,
  handleEditPerson,
  handleDeletePerson,
  copyTemplateData,
  setSelectedTemplateId,
}) => {
  const { t } = useTranslation();

  if (!selectedTemplate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedTemplate.name}
              </h2>
              {selectedTemplate.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedTemplate.description}
                </p>
              )}
            </div>
            <Button
              onClick={() => setSelectedTemplateId(null)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t("templatePeoplePagepeople")} ({selectedTemplate.people.length})
            </h3>
            <Button
              onClick={() => copyTemplateData(selectedTemplate)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              {t("copy_all_data")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedTemplate.people.map((person) => (
              <div
                key={person.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border"
              >
                {editingPerson === person.id ? (
                  <div className="space-y-2">
                    <Input
                      value={personName || person.name}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder={t("templatePeoplePagepersonNamePlaceholder")}
                    />
                    <Input
                      value={personPhone || person.phone}
                      onChange={(e) => setPersonPhone(e.target.value)}
                      placeholder={t(
                        "templatePeoplePagepersonPhonePlaceholder"
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          handleEditPerson(
                            person.id,
                            personName || person.name,
                            personPhone || person.phone
                          );
                          setPersonName("");
                          setPersonPhone("");
                        }}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save size={14} />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingPerson(null);
                          setPersonName("");
                          setPersonPhone("");
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-gray-600"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {person.name}
                      </h4>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => {
                            setEditingPerson(person.id);
                            setPersonName(person.name);
                            setPersonPhone(person.phone);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit size={12} />
                        </Button>
                        <Button
                          onClick={() =>
                            handleDeletePerson(person.id, selectedTemplate.id)
                          }
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Phone size={12} />
                      {person.phone}
                    </p>
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(person.phone)
                      }
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-800 text-xs mt-2"
                    >
                      <Copy size={12} className="mr-1" />
                      {t("copy_number")}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsModal;
