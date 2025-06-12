"use client";

import React, { useState, useEffect } from "react";
import { getActiveAccount } from "@/services/my_accounts";
import {
  deleteTemplateFromAPI,
  saveTemplateToAPI,
  updateTemplateToAPI,
} from "@/services/templateService";
import { fetchTemplatesFromAPI1 } from "@/services/templateService";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/useToast";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import TemplateManagerHeader from "@/components/molecules/TemplateManagerHeader";
import TemplateForm from "@/components/molecules/TemplateForm";
import TemplateSearchAndStats from "@/components/molecules/TemplateSearchAndStats";
import TemplateGrid from "@/components/molecules/TemplateGrid";
import TemplateDetailsModal from "@/components/molecules/TemplateDetailsModal";
import ConfirmationModal from "@/components/molecules/ConfirmationModal";

type Person = {
  _id?: string; // ← اختياري
  id: number;
  name: string;
  phone: string;
};

type Template = {
  _id?: string; // ← إضافة هذا
  id: number;
  name: string;
  people: Person[];
  createdAt: string;
  description?: string;
};

export default function EnhancedTemplateManagerPage() {
  const { t } = useTranslation();
  const [activeAccount, setActiveAccount] = useState<any>(null);

  // State Management
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [personName, setPersonName] = useState("");
  const [personPhone, setPersonPhone] = useState("");
  const [newPeople, setNewPeople] = useState<Person[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "template" | "person";
    id: number;
    templateId?: number;
  } | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [editingPerson, setEditingPerson] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  const selectedTemplate =
    templates.find((t) => t.id === selectedTemplateId) || null;

  // Load demo data
  useEffect(() => {
    const loadTemplatesAndAccount = async () => {
      try {
        const [remoteTemplates, activeAccountData] = await Promise.all([
          fetchTemplatesFromAPI1(),
          getActiveAccount(),
        ]);

        let localTemplates: any = [];
        if (remoteTemplates.length > 0) {
          // تحويل النتائج من API إلى البنية المحلية
          localTemplates = remoteTemplates.map((remote) => ({
            _id: remote._id,
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: remote.name,
            people: remote.contacts.map((contact) => ({
              _id: contact._id,
              id: Date.now(),
              name: contact.name,
              phone: contact.phone_number,
            })),
            createdAt: new Date().toLocaleDateString("ar-SA"),
          }));
        }

        setTemplates(localTemplates);

        if (activeAccountData?.id) {
          setActiveAccount({ id: activeAccountData.id });
        }
      } catch (error) {
        console.error("فشل في تحميل البيانات");
      }
    };

    loadTemplatesAndAccount();
  }, []);

  // Add person to temporary list
  const handleAddPersonToNewTemplate = () => {
    if (!activeAccount) {
      showToast(t("select_whatsapp_account_first"), "error");
      return;
    }

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

  // Save new template
  const handleSaveTemplate = async () => {
    if (!activeAccount) {
      showToast(t("select_whatsapp_account_first"), "error");
      return;
    }
    if (!templateName || newPeople.length === 0) return;

    setIsLoading(true);
    setLoadingMessage(t("saving_template"));

    try {
      const payload = {
        name: templateName,
        phone_numbers: newPeople.map(({ name, phone }) => ({
          name,
          phone_number: phone,
        })),
      };

      const response = await saveTemplateToAPI(payload);
      const newTemplate: Template = {
        id: response.id || Date.now(),
        name: templateName,
        people: newPeople,
        createdAt: new Date().toLocaleDateString("ar-SA"),
      };
      setTemplates([newTemplate, ...templates]);
      resetForm();
    } catch (error) {
      console.error("حدث خطأ أثناء حفظ القالب:", error);
      showToast(t("failed_to_save_template"), "error");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setTemplateName("");
    setTemplateDescription("");
    setNewPeople([]);
    setShowForm(false);
    setEditingTemplate(null);
  };

  // Delete template
  const handleDeleteTemplate = (id: number) => {
    setItemToDelete({ type: "template", id });
    setShowConfirmation(true);
  };

  // Delete person from template
  const handleDeletePerson = (personId: number, templateId: number) => {
    setItemToDelete({ type: "person", id: personId, templateId });
    setShowConfirmation(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    setLoadingMessage(
      itemToDelete.type === "template"
        ? t("deleting_template")
        : t("deleting_person")
    );

    try {
      if (itemToDelete.type === "template") {
        const templateToDelete = templates.find(
          (t) => t.id === itemToDelete.id
        );
        if (!templateToDelete || !templateToDelete._id) {
          showToast(`${t("template_id_not_found")}`, "error");
          return;
        }

        const success = await deleteTemplateFromAPI(templateToDelete._id);
        if (success) {
          setTemplates(templates.filter((t) => t.id !== itemToDelete.id));
          if (selectedTemplateId === itemToDelete.id) {
            setSelectedTemplateId(null);
          }
        } else {
          showToast(`${t("failed_to_delete_template")}`, "error");
        }
      } else if (itemToDelete.type === "person" && itemToDelete.templateId) {
        const template = templates.find(
          (t) => t.id === itemToDelete.templateId
        );
        if (template) {
          const updatedPeople = template.people.filter(
            (p) => p.id !== itemToDelete.id
          );
          const updatedTemplates = templates.map((t) =>
            t.id === itemToDelete.templateId
              ? { ...t, people: updatedPeople }
              : t
          );
          setTemplates(updatedTemplates);
        }
      }
    } catch (error) {
      console.error("حدث خطأ أثناء الحذف:", error);
      showToast(`${t("error_occurred_during_deletion")}`, "error");
    } finally {
      setShowConfirmation(false);
      setItemToDelete(null);
      setIsLoading(false);
      setLoadingMessage(null);
    }
  };
  // Cancel deletion
  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  // Edit template name
  const handleEditTemplateName = async (
    id: number,
    newName: string,
    newDescription: string = ""
  ) => {
    if (!newName.trim()) {
      showToast(`${t("template_name_required")}`, "info");
      return;
    }

    setIsLoading(true);
    setLoadingMessage(t("updating_template"));

    try {
      const templateToUpdate = templates.find((t) => t.id === id);
      if (!templateToUpdate || !templateToUpdate._id) {
        showToast(`${t("template_id_not_found")}`, "error");
        return;
      }

      const payload = {
        name: newName,
        phone_numbers: templateToUpdate.people.map((person) => ({
          name: person.name,
          phone_number: person.phone,
        })),
      };

      await updateTemplateToAPI(templateToUpdate._id, payload);

      const updatedTemplates = templates.map((t) =>
        t.id === id ? { ...t, name: newName, description: newDescription } : t
      );
      setTemplates(updatedTemplates);
      setEditingTemplate(null);
      setTemplateName("");
      setTemplateDescription("");

      showToast(`${t("template_updated_successfully")}`, "success");
    } catch (error) {
      console.error("حدث خطأ أثناء تحديث القالب:", error);
      showToast(`${t("failed_to_update_template")}`, "error");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  };

  // Edit person
  const handleEditPerson = async (
    personId: number,
    newName: string,
    newPhone: string
  ) => {
    if (!activeAccount) {
      showToast(t("select_whatsapp_account_first"), "error");
      return;
    }

    if (!selectedTemplate) return;

    const templateToUpdate = templates.find(
      (t) => t.id === selectedTemplate.id
    );
    if (!templateToUpdate || !templateToUpdate._id) {
      showToast(`${t("template_id_not_found")}`, "error");
      return;
    }

    try {
      const updatedPeople = selectedTemplate.people.map((p) =>
        p.id === personId ? { ...p, name: newName, phone: newPhone } : p
      );

      const payload = {
        name: selectedTemplate.name,
        phone_numbers: updatedPeople.map(({ name, phone }) => ({
          name,
          phone_number: phone,
        })),
      };

      await updateTemplateToAPI(templateToUpdate._id, payload);
      const updatedTemplates = templates.map((t) =>
        t.id === selectedTemplate.id ? { ...t, people: updatedPeople } : t
      );
      setTemplates(updatedTemplates);
      setEditingPerson(null);
      setPersonName("");
      setPersonPhone("");
      showToast(`${t("person_updated_successfully")}`, "success");
    } catch (error) {
      console.error(`${t("failed_to_update_person")}`, error);
      showToast(`${t("failed_to_update_person")}`, "error");
    }
  };

  // Copy template data
  const copyTemplateData = (template: Template) => {
    const data = template.people.map((p) => `${p.name}: ${p.phone}`).join("\n");
    navigator.clipboard.writeText(data);
  };

  // Filter templates
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.people.some(
        (person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.phone.includes(searchTerm)
      )
  );

  return (
    <div className="bg-gray-50 dark:bg-dark-blue-gray min-h-screen pb-10">
      {/* Header Section */}
      <TemplateManagerHeader
        activeAccount={activeAccount}
        showForm={showForm}
        setShowForm={setShowForm}
        showToast={showToast}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Create New Template Form */}
        <TemplateForm
          showForm={showForm}
          templateName={templateName}
          templateDescription={templateDescription}
          personName={personName}
          personPhone={personPhone}
          newPeople={newPeople}
          activeAccount={activeAccount}
          showToast={showToast}
          setTemplateName={setTemplateName}
          setTemplateDescription={setTemplateDescription}
          setPersonName={setPersonName}
          setPersonPhone={setPersonPhone}
          setNewPeople={setNewPeople}
          handleAddPersonToNewTemplate={handleAddPersonToNewTemplate}
          handleSaveTemplate={handleSaveTemplate}
          resetForm={resetForm}
        />

        {/* Search and Stats */}
        <TemplateSearchAndStats
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          templates={templates}
        />

        {/* Templates Grid */}
        <TemplateGrid
          filteredTemplates={filteredTemplates}
          editingTemplate={editingTemplate}
          templateName={templateName}
          templateDescription={templateDescription}
          setTemplateName={setTemplateName}
          setTemplateDescription={setTemplateDescription}
          setEditingTemplate={setEditingTemplate}
          handleEditTemplateName={handleEditTemplateName}
          handleDeleteTemplate={handleDeleteTemplate}
          copyTemplateData={copyTemplateData}
          setSelectedTemplateId={setSelectedTemplateId}
          showForm={showForm}
          setShowForm={setShowForm}
          activeAccount={activeAccount}
          showToast={showToast}
          searchTerm={searchTerm}
        />

        {/* Template Details Modal */}
        <TemplateDetailsModal
          selectedTemplate={selectedTemplate}
          editingPerson={editingPerson}
          personName={personName}
          personPhone={personPhone}
          setPersonName={setPersonName}
          setPersonPhone={setPersonPhone}
          setEditingPerson={setEditingPerson}
          handleEditPerson={handleEditPerson}
          handleDeletePerson={handleDeletePerson}
          copyTemplateData={copyTemplateData}
          setSelectedTemplateId={setSelectedTemplateId}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          showConfirmation={showConfirmation}
          itemToDelete={itemToDelete}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
        />
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner
            message={loadingMessage || t("preparing_account")}
            size="md"
            color="green"
          />
        </div>
      )}
    </div>
  );
}
