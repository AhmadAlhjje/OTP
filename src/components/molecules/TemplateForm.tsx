// TemplateForm.tsx
"use client";

import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Users, Phone, X } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { fetchContacts } from "@/services/message-service";

type Person = {
  id: number;
  name: string;
  phone: string;
};

type Contact = {
  _id: string;
  name: string;
  phone_number: string;
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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const { t } = useTranslation();

  // جلب جهات الاتصال وفتح النافذة
  const openContactsModal = async () => {
    try {
      const data = await fetchContacts();
      setContacts(data || []); // لا تستخدم data.contacts بل data مباشرة
      setShowContactsModal(true);
    } catch (error) {
      showToast("فشل في جلب جهات الاتصال", "error");
    }
  };

  return (
    <>
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-all ease-in-out duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            {t("templatePeoplePagecreateNewTemplate")}
          </h2>

          <div className="space-y-4">
            {/* اسم القالب */}
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

              {/* إضافة شخص يدويًا */}
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

              {/* زر فتح نافذة اختيار جهات الاتصال */}
              <Button
                onClick={openContactsModal}
                variant="secondary"
                className="mb-4"
              >
                {t("select_from_contacts")}
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

            {/* أزرار الحفظ والإلغاء */}
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

      {/* نافذة اختيار جهات الاتصال */}
      {showContactsModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2 text-center">
              {t("select_from_contacts")}
            </h2>

            {/* حقل البحث */}
            <input
              type="text"
              placeholder={
                t("search_by_name_or_number") || "ابحث بالاسم أو الرقم..."
              }
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full p-2 border rounded mb-3 dark:bg-gray-800 dark:text-white"
            />

            {/* قائمة جهات الاتصال مع الفلترة */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {contacts
                .filter((contact) => {
                  const text = filterText.toLowerCase();
                  return (
                    contact.name.toLowerCase().includes(text) ||
                    contact.phone_number.toLowerCase().includes(text)
                  );
                })
                .map((contact) => {
                  const isSelected = selectedContacts.some(
                    (c) => c.phone_number === contact.phone_number
                  );
                  return (
                    <button
                      key={contact.phone_number}
                      className={`w-full text-right p-3 rounded cursor-pointer ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedContacts(
                            selectedContacts.filter(
                              (c) => c.phone_number !== contact.phone_number
                            )
                          );
                        } else {
                          setSelectedContacts([...selectedContacts, contact]);
                        }
                      }}
                    >
                      {contact.name} - {contact.phone_number}
                    </button>
                  );
                })}
            </div>

            {/* أزرار الإضافة والإلغاء */}
            <div className="flex gap-2 mt-4">
              <button
                disabled={selectedContacts.length === 0}
                onClick={() => {
                  // أضف جهات الاتصال المحددة إلى newPeople مع تجنب التكرار
                  const newSelected = selectedContacts
                    .filter(
                      (sc) =>
                        !newPeople.some((np) => np.phone === sc.phone_number)
                    )
                    .map((sc) => ({
                      id: Date.now() + Math.random(),
                      name: sc.name,
                      phone: sc.phone_number,
                    }));

                  setNewPeople([...newPeople, ...newSelected]);
                  setSelectedContacts([]);
                  setShowContactsModal(false);
                  setFilterText("");
                }}
                className={`flex-1 py-2 rounded text-white ${
                  selectedContacts.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {t("add_selected_people")}
              </button>

              <button
                onClick={() => {
                  setShowContactsModal(false);
                  setSelectedContacts([]);
                  setFilterText("");
                }}
                className="flex-1 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateForm;
