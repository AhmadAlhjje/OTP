// "use client";

// import React, { useState } from "react";
// import Input from "@/components/atoms/Input";
// import Button from "@/components/atoms/Button";
// import Card from "@/components/molecules/Card"; // ← استخدام الـ Card الجديد
// import useTranslation from "@/hooks/useTranslation";

// type Person = {
//   id: number;
//   name: string;
//   phone: string;
// };

// type Template = {
//   id: number;
//   name: string;
//   people: Person[];
// };

// export default function TemplateManagerPage() {
//   const { t } = useTranslation();

//   //состояние для хранения всех шаблонов и текущего выбранного шаблона
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [templateName, setTemplateName] = useState(""); // имя нового шаблона
//   const [personName, setPersonName] = useState(""); // имя нового человека
//   const [personPhone, setPersonPhone] = useState(""); // телефон нового человека
//   const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null); // ID выбранного шаблона

//   // получение выбранного шаблона
//   const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

//   // Сохранение нового шаблона
//   const handleSaveTemplate = () => {
//     if (templateName) {
//       const newTemplate: Template = {
//         id: Date.now(),
//         name: templateName,
//         people: [],
//       };
//       setTemplates([newTemplate, ...templates]);
//       setTemplateName(""); // очистка поля ввода после сохранения
//     }
//   };

//   // Удаление шаблона
//   const handleDeleteTemplate = (id: number) => {
//     setTemplates(templates.filter((t) => t.id !== id));
//     if (selectedTemplateId === id) setSelectedTemplateId(null);
//   };

//   // Редактирование имени шаблона
//   const handleEditTemplateName = (id: number, newName: string) => {
//     const updatedTemplates = templates.map((t) =>
//       t.id === id ? { ...t, name: newName } : t
//     );
//     setTemplates(updatedTemplates);
//   };

//   // Добавление нового человека в выбранный шаблон
//   const handleAddPerson = () => {
//     if (!selectedTemplate) return;

//     const updatedPeople: Person[] = [
//       ...selectedTemplate.people,
//       {
//         id: Date.now(),
//         name: personName,
//         phone: personPhone,
//       },
//     ];

//     const updatedTemplates = templates.map((t) =>
//       t.id === selectedTemplate.id ? { ...t, people: updatedPeople } : t
//     );

//     setTemplates(updatedTemplates);
//     setPersonName(""); // очистка полей ввода после добавления
//     setPersonPhone("");
//   };

//   // Редактирование данных человека
//   const handleEditPerson = (personId: number, newName: string, newPhone: string) => {
//     if (!selectedTemplate) return;

//     const updatedPeople = selectedTemplate.people.map((p) =>
//       p.id === personId ? { ...p, name: newName, phone: newPhone } : p
//     );

//     const updatedTemplates = templates.map((t) =>
//       t.id === selectedTemplate.id ? { ...t, people: updatedPeople } : t
//     );
//     setTemplates(updatedTemplates);
//   };

//   // Удаление человека из шаблона
//   const handleDeletePerson = (personId: number) => {
//     if (!selectedTemplate) return;

//     const updatedPeople = selectedTemplate.people.filter((p) => p.id !== personId);
//     const updatedTemplates = templates.map((t) =>
//       t.id === selectedTemplate.id ? { ...t, people: updatedPeople } : t
//     );
//     setTemplates(updatedTemplates);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Заголовок */}
//       <h1 className="text-xl font-semibold dark:text-white">{t("templatePeoplePage.title")}</h1>

//       {/* Создание нового шаблона */}
//       <div className="space-y-4">
//         <Input
//           placeholder={t("templatePeoplePage.templateNamePlaceholder")}
//           value={templateName}
//           onChange={(e) => setTemplateName(e.target.value)}
//         />
//         <Button onClick={handleSaveTemplate}>
//           {t("templatePeoplePage.saveTemplate")}
//         </Button>
//       </div>

//       {/* Список существующих шаблонов */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
//         {templates.map((template) => (
//           <Card
//             key={template.id}
//             title={template.name}
//             content={`${template.people.length} ${t("templatePeoplePage.peopleCount")}`}
//             color="green-600"
//             onDelete={() => handleDeleteTemplate(template.id)}
//             onEdit={() => setSelectedTemplateId(template.id)}
//           />
//         ))}
//       </div>

//       {/* Панель редактирования выбранного шаблона */}
//       {selectedTemplate && (
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 mt-8">
//           {/* Редактирование названия шаблона */}
//           <Input
//             value={selectedTemplate.name}
//             onChange={(e) =>
//               handleEditTemplateName(selectedTemplate.id, e.target.value)
//             }
//           />

//           {/* Заголовок раздела "Люди" */}
//           <h2 className="text-lg font-semibold">{t("templatePeoplePage.template")}:</h2>

//           {/* Добавление нового человека */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Input
//               placeholder={t("templatePeoplePage.personNamePlaceholder")}
//               value={personName}
//               onChange={(e) => setPersonName(e.target.value)}
//             />
//             <Input
//               placeholder={t("templatePeoplePage.personPhonePlaceholder")}
//               value={personPhone}
//               onChange={(e) => setPersonPhone(e.target.value)}
//             />
//           </div>
//           <Button onClick={handleAddPerson}>
//             {t("templatePeoplePage.addPerson")}
//           </Button>

//           {/* Список людей в выбранном шаблоне */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
//             {selectedTemplate.people.map((person) => (
//               <Card
//                 key={person.id}
//                 title={person.name}
//                 content={person.phone}
//                 color="blue-600"
//                 onDelete={() => handleDeletePerson(person.id)}
//                 onEdit={() => {
//                   const newName = prompt(t("templatePeoplePage.personNamePlaceholder"), person.name);
//                   const newPhone = prompt(t("templatePeoplePage.personPhonePlaceholder"), person.phone);
//                   if (newName && newPhone) {
//                     handleEditPerson(person.id, newName, newPhone);
//                   }
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }