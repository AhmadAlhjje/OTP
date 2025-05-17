"use client";

import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import useTranslation from "@/hooks/useTranslation";

type Person = {
  id: number;
  name: string;
  phone: string;
};

type Template = {
  id: number;
  name: string;
  people: Person[];
};

export default function TemplateManagerPage() {
  const { t } = useTranslation();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [personName, setPersonName] = useState("");
  const [personPhone, setPersonPhone] = useState("");
  const [newPeople, setNewPeople] = useState<Person[]>([]); // الأشخاص قبل حفظ الـ Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  // إضافة شخص إلى القائمة المؤقتة
  const handleAddPersonToNewTemplate = () => {
    if (personName && personPhone) {
      const newPerson: Person = {
        id: Date.now(),
        name: personName,
        phone: personPhone,
      };
      setNewPeople([...newPeople, newPerson]);
      setPersonName("");
      setPersonPhone("");
    }
  };

  // حفظ الـ Template الجديد بعد إدخال الأشخاص
  const handleSaveTemplate = () => {
    if (templateName && newPeople.length > 0) {
      const newTemplate: Template = {
        id: Date.now(),
        name: templateName,
        people: newPeople,
      };
      setTemplates([newTemplate, ...templates]);
      setTemplateName("");
      setNewPeople([]);
    }
  };

  // حذف Template بالكامل
  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter((t) => t.id !== id));
    if (selectedTemplateId === id) setSelectedTemplateId(null);
  };

  // تعديل اسم Template
  const handleEditTemplateName = (id: number, newName: string) => {
    const updated = templates.map((t) =>
      t.id === id ? { ...t, name: newName } : t
    );
    setTemplates(updated);
  };

  // حذف شخص من Template محدد
  const handleDeletePerson = (personId: number) => {
    if (!selectedTemplate) return;
    const updatedPeople = selectedTemplate.people.filter((p) => p.id !== personId);
    const updatedTemplates = templates.map((t) =>
      t.id === selectedTemplate.id ? { ...t, people: updatedPeople } : t
    );
    setTemplates(updatedTemplates);
  };

  // تعديل شخص داخل Template محدد
  const handleEditPerson = (personId: number, newName: string, newPhone: string) => {
    if (!selectedTemplate) return;
    const updatedPeople = selectedTemplate.people.map((p) =>
      p.id === personId ? { ...p, name: newName, phone: newPhone } : p
    );
    const updatedTemplates = templates.map((t) =>
      t.id === selectedTemplate.id ? { ...t, people: updatedPeople } : t
    );
    setTemplates(updatedTemplates);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold dark:text-white">{t("templatePeoplePagetitle")}</h1>

      {/* إنشاء Template جديد */}
      <div className="space-y-4">
        <Input
          placeholder={t("templatePeoplePagetemplateNamePlaceholder")}
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder={t("templatePeoplePagepersonNamePlaceholder")}
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />
          <Input
            placeholder={t("templatePeoplePagepersonPhonePlaceholder")}
            value={personPhone}
            onChange={(e) => setPersonPhone(e.target.value)}
          />
        </div>
        <Button onClick={handleAddPersonToNewTemplate}>
          {t("templatePeoplePageaddPerson")}
        </Button>

        {/* عرض الأشخاص المؤقتين قبل حفظ الـ Template */}
        {newPeople.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {newPeople.map((person) => (
              <Card
                key={person.id}
                title={person.name}
                content={person.phone}
                color="blue-600"
              />
            ))}
          </div>
        )}

        <Button onClick={handleSaveTemplate} disabled={!templateName || newPeople.length === 0}>
          {t("templatePeoplePagesaveTemplate")}
        </Button>
      </div>

      {/* عرض جميع الـ Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            title={template.name}
            content={`${template.people.length} ${t("templatePeoplePagepeopleCount")}`}
            color="green-600"
            onDelete={() => handleDeleteTemplate(template.id)}
            onEdit={() => setSelectedTemplateId(template.id)}
          />
        ))}
      </div>

      {/* عرض الأشخاص داخل Template معين عند التحديد */}
      {selectedTemplate && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 mt-8">
          <Input
            value={selectedTemplate.name}
            onChange={(e) =>
              handleEditTemplateName(selectedTemplate.id, e.target.value)
            }
          />

          <h2 className="text-lg font-semibold">{t("templatePeoplePagetemplate")}:</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {selectedTemplate.people.map((person) => (
              <Card
                key={person.id}
                title={person.name}
                content={person.phone}
                color="blue-600"
                onDelete={() => handleDeletePerson(person.id)}
                onEdit={() => {
                  const newName = prompt(t("templatePeoplePagepersonNamePlaceholder"), person.name);
                  const newPhone = prompt(t("templatePeoplePagepersonPhonePlaceholder"), person.phone);
                  if (newName && newPhone) {
                    handleEditPerson(person.id, newName, newPhone);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
