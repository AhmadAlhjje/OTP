// organisms/MessageForm.tsx
// النموذج الكامل لإدخال بيانات الرسالة (الأرقام، الوقت، الرسالة، الإرسال)

import React from "react";
import ToggleSchedule from "@/components/molecules/ToggleSchedule";
import ScheduleDateTime from "@/components/molecules/ScheduleDateTime";
import RecipientInput from "@/components/molecules/RecipientInput";
import GroupSelector from "@/components/molecules/GroupSelector";
import MessageEditor from "@/components/molecules/MessageEditor";
import SendButton from "@/components/molecules/SendButton";

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

  // Send Button
  isLoading: boolean;
  handleSend: () => void;
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

  // Send Button
  isLoading,
  handleSend,
}) => {
  return (
    <div className="space-y-6">
      {/* Toggle Schedule */}
      <ToggleSchedule
        isScheduled={isScheduled}
        setIsScheduled={setIsScheduled}
      />

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
        // setTemplates={setTemplates}
        setSelectedTemplate={setSelectedTemplate}
        templatesLoading={templatesLoading}
        setShowTemplateDropdown={setShowTemplateDropdown}
        handleTemplateSelect={handleTemplateSelect}
        setTemplates={function (t: any[]): void {
          throw new Error("Function not implemented.");
        }}
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
