"use client";
import React, { useEffect, useState } from "react";
import MessageForm from "@/components/organisms/MessageForm";
import SidebarPreview from "@/components/organisms/SidebarPreview";
import AccountSwitcher from "@/components/atoms/AccountSwitcher";
import useLanguage from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { sendWhatsappMessage1 as sendImmediateMessage } from "@/services/message-service";
import { sendWhatsappMessage } from "@/services/schedule-massage";
import { fetchTemplatesFromAPI } from "@/services/templateMassageService"; // ← جلب القوالب من /templates
import { fetchTemplatesFromAPI1 } from "@/services/templateService";
import { useToast } from "@/hooks/useToast";
import { getActiveAccount, getWhatsappAccounts } from "@/services/my_accounts";
import { APITemplate } from "@/types/whatsappTemplate";
import useTranslation from "@/hooks/useTranslation";
import { GroupFromAPI } from "@/types/send_whatsapp";

const EnhancedWhatsAppScheduler = () => {
  const [activeAccount, setActiveAccount] = useState<any>(null);
  const [currentNumber, setCurrentNumber] = useState("");
  const [recipientNumbers, setRecipientNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [groups, setGroups] = useState<GroupFromAPI[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<GroupFromAPI[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [templates, setTemplates] = useState<APITemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<APITemplate | null>(
    null
  );
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const fetchData = async (accountId: string) => {
    try {
      setGroupsLoading(true);
      setTemplatesLoading(true);

      // --- جلب البيانات ---
      const [allAccounts, fetchedGroups, fetchedTemplates] = await Promise.all([
        getWhatsappAccounts(),
        fetchTemplatesFromAPI1(),
        fetchTemplatesFromAPI(),
      ]);

      // --- معالجة الحساب النشط ---
      const fullAccount = allAccounts.find(
        (account: { id: string }) => account.id === accountId
      );

      if (fullAccount) {
        setActiveAccount({
          id: fullAccount.id,
          name: fullAccount.name,
          phone: fullAccount.phone || null,
        });
      } else {
        setActiveAccount(null);
      }

      // --- معالجة المجموعات ---
      setGroups(fetchedGroups);

      // --- معالجة القوالب ---
      const localTemplates = fetchedTemplates.map((t) => ({
        ...t,
        id: t._id,
      }));
      setTemplates(localTemplates);
    } catch (error: any) {
      console.error(t("error_occurred_during"), error);
      showToast(t("failed_to_load_data"), "error");
    } finally {
      setGroupsLoading(false);
      setTemplatesLoading(false);
    }
  };

  // ----- New function to handle account change -----
  const handleAccountChange = async (accountId: string) => {
    setIsLoading(true); // Optional: show loading spinner
    try {
      await fetchData(accountId);
    } catch (err) {
      showToast(t("failed_to_refresh_account_data"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const activeAccountData = await getActiveAccount();
      if (activeAccountData?.id) {
        await handleAccountChange(activeAccountData.id);
      }
    };
    initialize();
  }, []);

  const handleSend = async () => {
    if (!activeAccount) {
      showToast(t("toastno_account"), "error");
      return;
    }
    if (!activeAccount) {
      showToast(t("toastno_account"), "error");
      return;
    }

    if (recipientNumbers.length === 0 && selectedGroups.length === 0) {
      showToast(t("toastno_recipients"), "error");
      return;
    }

    if (isTemplateMode && !selectedTemplate) {
      showToast(t("toastno_template"), "error");
      return;
    }

    if (!isTemplateMode && !message.trim()) {
      showToast(t("toastno_message"), "error");
      return;
    }

    if (isScheduled && !scheduledTime) {
      showToast(t("toastno_schedule_time"), "error");
      return;
    }

    if (isScheduled && scheduledTime && scheduledTime <= new Date()) {
      showToast(t("toastinvalid_schedule_time"), "error");
      return;
    }

    setIsLoading(true);

    try {
      const messageContent = isTemplateMode
        ? selectedTemplate!.id // ← استخدم ! لتأكيد أن القيمة موجودة
        : message.trim();

      const allRecipients = [
        ...recipientNumbers,
        ...selectedGroups.map((group) => group._id),
      ];

      if (isScheduled) {
        const res = await sendWhatsappMessage({
          to: allRecipients,
          message: messageContent,
          scheduledAt: scheduledTime?.toISOString().replace(/\.\d{3}Z$/, "Z"),
        });

        if (res.status === 201) {
          showToast(t("toastmessage_scheduled"), "success");
          resetForm();
        } else {
          showToast(t("message_scheduled_failed"), "error");
        }
      } else {
        const res = await sendImmediateMessage({
          to: allRecipients,
          message: messageContent,
        });

        if (res.status === 201) {
          showToast(t("toastmessage_sent"), "success");
          resetForm();
        } else {
          showToast(
            t("send_failed_with_reason") +
              (res.data.message || t("unknown_error")),
            "error"
          );
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : t("send_failed_with_reason"));

      showToast(
        `${t("error_occurred")} ${
          isScheduled ? t("schedule") : t("send")
        }: ${errorMessage}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- اختيار مجموعة ---
  const handleGroupSelect = (group: GroupFromAPI) => {
    if (!activeAccount) {
      showToast(t("toastno_account"), "error");
      return;
    }
    if (!selectedGroups.some((g) => g._id === group._id)) {
      setSelectedGroups([...selectedGroups, group]);
    }
    setShowGroupDropdown(false);
  };

  const handleRemoveGroup = (groupId: string) => {
    setSelectedGroups(selectedGroups.filter((g) => g._id !== groupId));
  };

  // --- إضافة رقم هاتف ---
  const validatePhoneNumber = (number: string) => {
    const trimmed = number.trim();
    return trimmed.length >= 10 && /^\+?\d+$/.test(trimmed);
  };

  const handleAddNumber = () => {
    if (!activeAccount) {
      showToast(t("toastno_account"), "error");
      return;
    }
    const trimmed = currentNumber.trim();
    if (!validatePhoneNumber(trimmed)) {
      showToast(t("enter_valid_number"), "info");
      return;
    }
    if (!recipientNumbers.includes(trimmed)) {
      setRecipientNumbers([...recipientNumbers, trimmed]);
      setCurrentNumber("");
    } else {
      showToast(t("number_already_exists"), "info");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNumber();
    }
  };

  const handleRemoveNumber = (number: string) => {
    setRecipientNumbers(recipientNumbers.filter((n) => n !== number));
  };

  // --- اختيار قالب رسالة ---
  const handleTemplateSelect = (template: APITemplate) => {
    setSelectedTemplate(template);
    setMessage(template.content);
    setShowTemplateDropdown(false);
  };

  const handleTemplateModeToggle = () => {
    setIsTemplateMode(!isTemplateMode);
    if (!isTemplateMode) {
      setMessage("");
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(null);
    }
  };

  // --- إعادة تعيين النموذج ---
  const resetForm = () => {
    setRecipientNumbers([]);
    setSelectedGroups([]);
    setMessage("");
    setScheduledTime(null);
    setIsScheduled(false);
    setSelectedTemplate(null);
    setIsTemplateMode(false);
  };

  // --- تحديد أقل وقت ممكن ---
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now;
  };

  // --- تنسيق الوقت ---
  const formatScheduledTime = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="p-6 w-full space-y-8 min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      {/* رأس الصفحة */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="h-8 w-8 text-green-600 dark:text-green-400">
              📱
            </span>
            {isScheduled && (
              <span className="absolute -top-1 -right-1 h-4 w-4 text-orange-500 animate-pulse">
                ⏰
              </span>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {t("sendMessage")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isScheduled
                ? `${t("scheduled_messages")}`
                : `${t("immediate_messages")}`}
            </p>
          </div>
        </div>
        {activeAccount && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 px-5 py-3 rounded-xl shadow-lg border border-green-200 dark:border-green-700"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {t("active_account")} :
              </span>
              <span className="font-bold">{activeAccount.name}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MessageForm
          // Toggle Schedule
          isScheduled={isScheduled}
          setIsScheduled={setIsScheduled}
          // Schedule Time
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          getMinDateTime={getMinDateTime}
          formatScheduledTime={formatScheduledTime}
          // Recipient Input
          currentNumber={currentNumber}
          setCurrentNumber={setCurrentNumber}
          recipientNumbers={recipientNumbers}
          setRecipientNumbers={setRecipientNumbers}
          handleKeyPress={handleKeyPress}
          handleAddNumber={handleAddNumber}
          handleRemoveNumber={handleRemoveNumber}
          // Group Selector
          groups={groups}
          selectedGroups={selectedGroups}
          setSelectedGroups={setSelectedGroups}
          showGroupDropdown={showGroupDropdown}
          setShowGroupDropdown={setShowGroupDropdown}
          handleGroupSelect={handleGroupSelect}
          handleRemoveGroup={handleRemoveGroup}
          groupsLoading={groupsLoading}
          // Message Editor
          message={message}
          setMessage={setMessage}
          isTemplateMode={isTemplateMode}
          setIsTemplateMode={setIsTemplateMode}
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          templatesLoading={templatesLoading}
          showTemplateDropdown={showTemplateDropdown}
          setShowTemplateDropdown={setShowTemplateDropdown}
          handleTemplateSelect={handleTemplateSelect}
          // Send Button
          isLoading={isLoading}
          handleSend={handleSend}
        />

        <SidebarPreview
          recipientNumbers={recipientNumbers}
          message={message}
          isScheduled={isScheduled}
          isTemplateMode={isTemplateMode}
          selectedTemplate={selectedTemplate}
        />
      </div>

      {/* مبدل الحسابات */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className={`fixed bottom-6 ${
          language === "ar" ? "left-6" : "right-6"
        } z-50`}
      >
        <div className="bg-white/90 backdrop-blur-md dark:bg-gray-800/90 p-2 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <AccountSwitcher
            accountName={activeAccount?.name || t("no_account_selected")}
            onAccountChange={handleAccountChange} 
          />
        </div>
      </motion.div> */}
    </div>
  );
};

export default EnhancedWhatsAppScheduler;
