// TemplateForm.tsx
"use client";

import React from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Users, Phone, X } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

type Person = {
  id: number;
  name: string;
  phone: string;
};

interface TemplateFormProps {
  showForm: boolean;
  templateName: string;
  templateDescription: string;
  personName: string;
  personPhone: string;
  newPeople: Person[];
  activeAccount: any;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  setTemplateName: (name: string) => void;
  setTemplateDescription: (description: string) => void;
  setPersonName: (name: string) => void;
  setPersonPhone: (phone: string) => void;
  setNewPeople: (people: Person[]) => void;
  handleAddPersonToNewTemplate: () => void;
  handleSaveTemplate: () => void;
  resetForm: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  showForm,
  templateName,
  templateDescription,
  personName,
  personPhone,
  newPeople,
  activeAccount,
  showToast,
  setTemplateName,
  setTemplateDescription,
  setPersonName,
  setPersonPhone,
  setNewPeople,
  handleAddPersonToNewTemplate,
  handleSaveTemplate,
  resetForm,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-all ease-in-out duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            {t("templatePeoplePagecreateNewTemplate")}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("templatePeoplePagetemplateName")}
                </label>
                <Input
                  placeholder={t("templatePeoplePagetemplateNamePlaceholder")}
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                {t("templatePeoplePageaddPeople")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder={t("templatePeoplePagepersonNamePlaceholder")}
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  icon={<Users className="w-4 h-4" />}
                />
                <Input
                  placeholder={t("templatePeoplePagepersonPhonePlaceholder")}
                  value={personPhone}
                  onChange={(e) => setPersonPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              <Button
                onClick={() => {
                  if (!activeAccount) {
                    showToast(t("select_whatsapp_account_first"), "error");
                    return;
                  }
                  handleAddPersonToNewTemplate();
                }}
                disabled={!personName || !personPhone}
                className="bg-green-600 hover:bg-green-700 text-white mb-4"
              >
                {t("templatePeoplePageaddPerson")}
              </Button>

              {/* قائمة الأشخاص المضافين */}
              {newPeople.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("templatePeoplePageaddedPeople")} ({newPeople.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {newPeople.map((person) => (
                      <div
                        key={person.id}
                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {person.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {person.phone}
                          </p>
                        </div>
                        <Button
                          onClick={() =>
                            setNewPeople(
                              newPeople.filter((p) => p.id !== person.id)
                            )
                          }
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t">
              <Button
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleSaveTemplate}
                disabled={!templateName || newPeople.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("templatePeoplePagesaveTemplate")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateForm;