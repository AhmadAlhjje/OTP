import React, { useState } from "react";
import ToggleSchedule from "@/components/molecules/ToggleSchedule";
import ScheduleDateTime from "@/components/molecules/ScheduleDateTime";
import RecipientInput from "@/components/molecules/RecipientInput";
import GroupSelector from "@/components/molecules/GroupSelector";
import MessageEditor from "@/components/molecules/MessageEditor";
import SendButton from "@/components/molecules/SendButton";
import { fetchContacts } from "@/services/message-service";

interface MessageFormProps {
  // Toggle Schedule
  isScheduled: boolean;
  setIsScheduled: (val: boolean) => void;

  // Schedule Time
  scheduledTime: Date | null;
  setScheduledTime: (date: Date | null) => void;
  getMinDateTime: () => Date;
  formatScheduledTime: (date: Date) => string;

  // Recipient Input
  currentNumber: string;
  setCurrentNumber: (val: string) => void;
  recipientNumbers: string[];
  setRecipientNumbers: (nums: string[]) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleAddNumber: () => void;
  handleRemoveNumber: (number: string) => void;

  // Group Selector
  groups: any[];
  selectedGroups: any[];
  setSelectedGroups: (groups: any[]) => void;
  showGroupDropdown: boolean;
  setShowGroupDropdown: (val: boolean) => void;
  handleGroupSelect: (group: any) => void;
  handleRemoveGroup: (id: string) => void;
  groupsLoading: boolean;

  // Message Editor
  message: string;
  setMessage: (msg: string) => void;
  isTemplateMode: boolean;
  setIsTemplateMode: (val: boolean) => void;
  templates: any[];
  selectedTemplate: any;
  setSelectedTemplate: (template: any) => void;
  templatesLoading: boolean;
  showTemplateDropdown: boolean;
  setShowTemplateDropdown: (val: boolean) => void;
  handleTemplateSelect: (template: any) => void;

  // ✅ تعديل props لتدعم صورة أو فيديو (media)
  selectedMedia: File | null;
  handleMediaSelect: (file: File | null) => void;

  // ✅ إضافة setTemplates لأن MessageEditor يطلبها
  setTemplates: (templates: any[]) => void;

  // Send Button
  isLoading: boolean;
  handleSend: () => void;
}

interface Contact {
  name: string;
  phone_number: string;
}

const MessageForm: React.FC<MessageFormProps> = ({
  // Toggle Schedule
  isScheduled,
  setIsScheduled,

  // Schedule Time
  scheduledTime,
  setScheduledTime,
  getMinDateTime,
  formatScheduledTime,

  // Recipient Input
  currentNumber,
  setCurrentNumber,
  recipientNumbers,
  setRecipientNumbers,
  handleKeyPress,
  handleAddNumber,
  handleRemoveNumber,

  // Group Selector
  groups,
  selectedGroups,
  setSelectedGroups,
  showGroupDropdown,
  setShowGroupDropdown,
  handleGroupSelect,
  handleRemoveGroup,
  groupsLoading,

  // Message Editor
  message,
  setMessage,
  isTemplateMode,
  setIsTemplateMode,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  templatesLoading,
  showTemplateDropdown,
  setShowTemplateDropdown,
  handleTemplateSelect,

  // ✅ Media props
  selectedMedia,
  handleMediaSelect,

  // ✅ setTemplates
  setTemplates,

  // Send Button
  isLoading,
  handleSend,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const handleSelectContact = async () => {
    try {
      const data = await fetchContacts();
      console.log("data" ,data);
      setContacts(data);
      setShowContactsModal(true);
    } catch (error) {
      console.error("فشل في تحميل جهات الاتصال:", error);
    }
  };

  return (
    <div className="space-y-6">
      {showContactsModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2 text-center">اختر جهات اتصال</h2>

            {/* حقل البحث */}
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرقم..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full p-2 border rounded mb-3 dark:bg-gray-800 dark:text-white"
            />

            {/* قائمة جهات الاتصال بعد الفلترة */}
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
                      {contact.name}
                    </button>
                  );
                })}
            </div>

            {/* أزرار الإضافة والإغلاق */}
            <div className="flex gap-2 mt-4">
              <button
                disabled={selectedContacts.length === 0}
                onClick={() => {
                  const newNumbers = selectedContacts
                    .map((c) => c.phone_number)
                    .filter((num) => !recipientNumbers.includes(num));

                  if (newNumbers.length > 0) {
                    setRecipientNumbers([...recipientNumbers, ...newNumbers]);
                  }

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
                إضافة المحددين
              </button>

              <button
                onClick={() => {
                  setShowContactsModal(false);
                  setSelectedContacts([]);
                  setFilterText("");
                }}
                className="flex-1 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Schedule */}
      <ToggleSchedule isScheduled={isScheduled} setIsScheduled={setIsScheduled} />

      {/* Schedule DateTime */}
      {isScheduled && (
        <ScheduleDateTime
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          getMinDateTime={getMinDateTime}
          formatScheduledTime={formatScheduledTime}
        />
      )}

      {/* Recipient Input */}
      <RecipientInput
        currentNumber={currentNumber}
        setCurrentNumber={setCurrentNumber}
        recipientNumbers={recipientNumbers}
        setRecipientNumbers={setRecipientNumbers}
        handleKeyPress={handleKeyPress}
        handleAddNumber={handleAddNumber}
        onSelectContact={handleSelectContact}
      />

      {/* Group Selector */}
      <GroupSelector
        groups={groups}
        selectedGroups={selectedGroups}
        setSelectedGroups={setSelectedGroups}
        loading={groupsLoading}
        showDropdown={showGroupDropdown}
        setShowDropdown={setShowGroupDropdown}
        handleSelect={handleGroupSelect}
        handleRemove={handleRemoveGroup}
      />

      {/* Message Editor */}
      <MessageEditor
        message={message}
        setMessage={setMessage}
        isTemplateMode={isTemplateMode}
        setIsTemplateMode={setIsTemplateMode}
        selectedTemplate={selectedTemplate}
        templates={templates}
        setSelectedTemplate={setSelectedTemplate}
        templatesLoading={templatesLoading}
        setShowTemplateDropdown={setShowTemplateDropdown}
        handleTemplateSelect={handleTemplateSelect}

        // ✅ تمرير setTemplates
        setTemplates={setTemplates}

        // تعديل props الصورة -> ملف وسائط
        selectedMedia={selectedMedia}
        onMediaSelect={handleMediaSelect}
      />

      {/* Send Button */}
      <SendButton
        isLoading={isLoading}
        isScheduled={isScheduled}
        isTemplateMode={isTemplateMode}
        onClick={handleSend}
      />
    </div>
  );
};

export default MessageForm;
