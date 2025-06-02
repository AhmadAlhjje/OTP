"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import {
  deleteTemplateFromAPI,
  saveTemplateToAPI,
  updateTemplateToAPI,
} from "@/services/templateService";
import { fetchTemplatesFromAPI1 } from "@/services/templateService";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Copy,
  Phone,
  User,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/useToast";

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
  const { showToast } = useToast();

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  // Load demo data
  useEffect(() => {
    const loadTemplates = async () => {
      const remoteTemplates = await fetchTemplatesFromAPI1();

      if (remoteTemplates.length > 0) {
        // تحويل النتائج من API إلى البنية المحلية
        const localTemplates = remoteTemplates.map((remote) => ({
          _id: remote._id, // ← сохрани ID من السيرفر
          id: Date.now() + Math.floor(Math.random() * 1000), // ID محلي للاستخدام في UI
          name: remote.name,
          people: remote.contacts.map((contact) => ({
            _id: contact._id, // ← сохрани ID الشخص من السيرفر
            id: Date.now(),
            name: contact.name,
            phone: contact.phone_number,
          })),
          createdAt: new Date().toLocaleDateString("ar-SA"),
        }));
        setTemplates(localTemplates);
      } else {
        // يمكنك هنا عرض رسالة خطأ للمستخدم أو استخدام بيانات افتراضية مؤقتة
        console.warn("لم يتم العثور على أي قوالب من الخادم.");
      }
    };

    loadTemplates();
  }, []);

  // Add person to temporary list
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

  // Save new template
  const handleSaveTemplate = async () => {
    if (!templateName || newPeople.length === 0) {
      return; // تأكد من أن هناك اسم للقالب وأشخاص مضافين
    }

    try {
      // تحويل people إلى phone_numbers كما في هيكل الـ API
      const payload = {
        name: templateName,
        phone_numbers: newPeople.map(({ name, phone }) => ({
          name,
          phone_number: phone,
        })),
      };

      console.log(payload);
      // إرسال البيانات إلى API
      const response = await saveTemplateToAPI(payload);

      // بعد النجاح، نضيف القالب إلى القائمة المحلية (يمكن استخدام ID من الاستجابة)
      const newTemplate: Template = {
        id: response.id || Date.now(),
        name: templateName,
        description: templateDescription,
        people: newPeople,
        createdAt: new Date().toLocaleDateString("ar-SA"),
      };
      setTemplates([newTemplate, ...templates]);
      resetForm();
    } catch (error) {
      console.error("حدث خطأ أثناء حفظ القالب:", error);
      showToast("فشل في حفظ القالب. يرجى المحاولة لاحقًا.", "error");
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
    console.log(itemToDelete.id);
    try {
      if (itemToDelete.type === "template") {
        const templateToDelete = templates.find(
          (t) => t.id === itemToDelete.id
        );
        if (!templateToDelete || !templateToDelete._id) {
          showToast("معرف القالب غير موجود", "error");
          return;
        }

        const success = await deleteTemplateFromAPI(templateToDelete._id);
        if (success) {
          setTemplates(templates.filter((t) => t.id !== itemToDelete.id));
          if (selectedTemplateId === itemToDelete.id) {
            setSelectedTemplateId(null);
          }
        } else {
          showToast("فشل في حذف القالب من السيرفر", "error");
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
      showToast("حدث خطأ أثناء الحذف.", "error");
    }

    setShowConfirmation(false);
    setItemToDelete(null);
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
      showToast("يجب إدخال اسم للقالب", "info");
      return;
    }

    try {
      // العثور على القالب المحلي الذي يحتوي على _id من السيرفر
      const templateToUpdate = templates.find((t) => t.id === id);
      if (!templateToUpdate || !templateToUpdate._id) {
        showToast("معرف القالب غير موجود", "error");
        return;
      }

      // بناء payload كما هو متوقع من الـ API
      const payload = {
        name: newName,
        phone_numbers: templateToUpdate.people.map((person) => ({
          name: person.name,
          phone_number: person.phone,
        })),
      };

      // إرسال التعديل إلى السيرفر باستخدام PUT
      const response = await updateTemplateToAPI(templateToUpdate._id, payload);

      // تحديث حالة القوالب في الواجهة
      const updatedTemplates = templates.map((t) =>
        t.id === id ? { ...t, name: newName, description: newDescription } : t
      );
      setTemplates(updatedTemplates);

      setEditingTemplate(null);
      setTemplateName("");
      setTemplateDescription("");

      showToast("تم تحديث القالب بنجاح!", "success");
    } catch (error) {
      console.error("حدث خطأ أثناء تحديث القالب:", error);
      showToast("فشل في تحديث القالب. يرجى المحاولة لاحقًا.", "error");
    }
  };

  // Edit person
  const handleEditPerson = async (
    personId: number,
    newName: string,
    newPhone: string
  ) => {
    if (!selectedTemplate) return;

    const templateToUpdate = templates.find(
      (t) => t.id === selectedTemplate.id
    );

    if (!templateToUpdate || !templateToUpdate._id) {
      showToast("معرف القالب غير موجود", "success");
      return;
    }

    try {
      // تحديث قائمة الأشخاص محليًا
      const updatedPeople = selectedTemplate.people.map((p) =>
        p.id === personId ? { ...p, name: newName, phone: newPhone } : p
      );

      // بناء payload ليتم إرساله إلى API
      const payload = {
        name: selectedTemplate.name,
        phone_numbers: updatedPeople.map(({ name, phone }) => ({
          name,
          phone_number: phone, // ← متأكد أن الحقل هو phone_number
        })),
      };

      // إرسال التعديل إلى السيرفر
      await updateTemplateToAPI(templateToUpdate._id, payload);

      // تحديث حالة الواجهة
      const updatedTemplates = templates.map((t) =>
        t.id === selectedTemplate.id ? { ...t, people: updatedPeople } : t
      );

      setTemplates(updatedTemplates);
      setEditingPerson(null);
      setPersonName("");
      setPersonPhone("");

      showToast("تم تحديث الشخص بنجاح!", "success");
    } catch (error) {
      console.error("حدث خطأ أثناء تحديث الشخص:", error);
      showToast("فشل في تحديث الشخص. يرجى المحاولة لاحقًا.", "error");
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
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("templatePeoplePagetitle")}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  إدارة قوائم الأشخاص والمجموعات
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 ${
                showForm
                  ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } rounded-full px-4 py-2 transition-all`}
            >
              {showForm ? (
                <>
                  {/* <X size={18} /> */}
                  إلغاء
                </>
              ) : (
                <>
                  {/* <Plus size={18} /> */}
                  إضافة قالب جديد
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Create New Template Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-all ease-in-out duration-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              {/* <Plus className="w-5 h-5" /> */}
              إنشاء قالب جديد
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    اسم القالب
                  </label>
                  <Input
                    placeholder={t("templatePeoplePagetemplateNamePlaceholder")}
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الوصف (اختياري)
                  </label>
                  <Input
                    placeholder="وصف مختصر للقالب"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    className="w-full"
                  />
                </div> */}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  {/* <UserPlus className="w-4 h-4" /> */}
                  إضافة الأشخاص
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder={t("templatePeoplePagepersonNamePlaceholder")}
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                  />
                  <Input
                    placeholder={t("templatePeoplePagepersonPhonePlaceholder")}
                    value={personPhone}
                    onChange={(e) => setPersonPhone(e.target.value)}
                    icon={<Phone className="w-4 h-4" />}
                  />
                </div>

                <Button
                  onClick={handleAddPersonToNewTemplate}
                  disabled={!personName || !personPhone}
                  className="bg-green-600 hover:bg-green-700 text-white mb-4"
                >
                  {/* <Plus className="w-4 h-4 mr-2" /> */}
                  {t("templatePeoplePageaddPerson")}
                </Button>

                {/* Preview of added people */}
                {newPeople.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      الأشخاص المضافون ({newPeople.length})
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
                  إلغاء
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  disabled={!templateName || newPeople.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {/* <Save className="w-4 h-4 mr-2" /> */}
                  {t("templatePeoplePagesaveTemplate")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="البحث في القوالب والأشخاص..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="w-full"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-4">
            <span>
              إجمالي القوالب:{" "}
              <span className="font-semibold text-blue-600">
                {templates.length}
              </span>
            </span>
            <span>
              إجمالي الأشخاص:{" "}
              <span className="font-semibold text-green-600">
                {templates.reduce((sum, t) => sum + t.people.length, 0)}
              </span>
            </span>
          </div>
        </div>

        {/* Templates Grid */}
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
                            value={templateName || template.name}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="text-lg font-semibold"
                          />
                          {/* <Input
                            value={
                              templateDescription || template.description || ""
                            }
                            onChange={(e) =>
                              setTemplateDescription(e.target.value)
                            }
                            placeholder="وصف القالب"
                            className="text-sm"
                          /> */}
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
                      <span>{template.people.length} شخص</span>
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
                                templateDescription || template.description
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
                            title="تعديل القالب"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteTemplate(template.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 p-1"
                            title="حذف القالب"
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
                        title="نسخ البيانات"
                      >
                        <Copy size={14} className="mr-1" />
                        نسخ
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
              {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد قوالب"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? "جرب البحث بكلمات مختلفة" : "ابدأ بإنشاء قالب جديد"}
            </p>
            {!showForm && !searchTerm && (
              <div className="mt-6">
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {/* <Plus className="mr-2 h-4 w-4" /> */}
                  إنشاء أول قالب
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Template Details Modal */}
        {selectedTemplate && (
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
                    الأشخاص ({selectedTemplate.people.length})
                  </h3>
                  <Button
                    onClick={() => copyTemplateData(selectedTemplate)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    {/* <Copy size={16} className="mr-2" /> */}
                    نسخ جميع البيانات
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
                            placeholder="اسم الشخص"
                          />
                          <Input
                            value={personPhone || person.phone}
                            onChange={(e) => setPersonPhone(e.target.value)}
                            placeholder="رقم الهاتف"
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
                                  handleDeletePerson(
                                    person.id,
                                    selectedTemplate.id
                                  )
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
                            نسخ الرقم
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                تأكيد الحذف
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {itemToDelete?.type === "template"
                  ? "هل أنت متأكد من حذف هذا القالب؟ سيتم حذف جميع الأشخاص المرتبطين به."
                  : "هل أنت متأكد من حذف هذا الشخص؟"}
              </p>
              <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                <Button
                  onClick={cancelDelete}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  حذف
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
