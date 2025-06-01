// EnhancedWhatsAppScheduler.tsx
"use client";
import React, { useEffect, useState } from "react";
import MessageForm from "@/components/organisms/MessageForm";
import SidebarPreview from "@/components/organisms/SidebarPreview";
import useLanguage from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { sendWhatsappMessage as sendImmediateMessage } from "@/services/message-service";
import { sendWhatsappMessage } from "@/services/schedule-massage";
import { fetchTemplatesFromAPI } from "@/services/templateMassageService";
import { fetchTemplatesFromAPI1 } from "@/services/templateService";
import { useToast } from "@/hooks/useToast";
import { getActiveAccount, getWhatsappAccounts } from "@/services/my_accounts";
import { APITemplate } from "@/types/whatsappTemplate";
import useTranslation from "@/hooks/useTranslation";

// Interface للحساب النشط
interface ActiveAccount {
  name: string;
}

// Interface للمجموعات
interface GroupFromAPI {
  _id: string;
  name: string;
  description?: string;
  membersCount?: number;
}

const EnhancedWhatsAppScheduler = () => {
  const [activeAccount, setActiveAccount] = useState<ActiveAccount | null>(
    null
  );
  const [currentNumber, setCurrentNumber] = useState("");
  const [recipientNumbers, setRecipientNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [showScheduleSuccess, setShowScheduleSuccess] = useState(false);
  const [groups, setGroups] = useState<GroupFromAPI[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<GroupFromAPI[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showGroups, setShowGroups] = useState(false);

  // Template related states
  const [templates, setTemplates] = useState<APITemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<APITemplate | null>(
    null
  );
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const { language } = useLanguage();
  const { showToast } = useToast();
  const isRTL = language === "ar";
  const { t } = useTranslation();

  // --- التحميل الأولي للحساب النشط ---
  useEffect(() => {
    const fetchActive = async () => {
      try {
        // جلب جميع الحسابات
        const allAccounts = await getWhatsappAccounts();
        // جلب بيانات الحساب النشط
        const activeAccountData = await getActiveAccount();

        // البحث عن الحساب النشط في القائمة
        if (activeAccountData?.id && Array.isArray(allAccounts)) {
          const fullAccount = allAccounts.find(
            (account) => account.id === activeAccountData.id
          );

          // تحديث الحساب النشط بالبيانات الكاملة
          if (fullAccount) {
            setActiveAccount({ name: fullAccount.name });
          }
        } else {
          setActiveAccount(null);
          showToast(t("no_active_account"), "info");
        }
      } catch (error) {
        console.error(t("fetch_active_account_error"), error);
        showToast(t("failed_to_load_active_account"), "error");
      }
    };
    fetchActive();
  }, [t]);

  // --- جلب القوالب من API ---
  useEffect(() => {
    const fetchTemplates = async () => {
      setTemplatesLoading(true);
      try {
        const fetchedTemplates = await fetchTemplatesFromAPI(); // 📥 جلب البيانات من API

        // ✨ تحويل البيانات مع جعل id = _id (كاملًا) ونوعه String
        const localTemplates = fetchedTemplates.map((t) => ({
          ...t,
          id: t._id, // ← هنا تم حفظ id كـ String بدون أي تحويل
        }));
        setTemplates(localTemplates); // ✅ إسناد البيانات الموحدة
      } catch (error) {
        console.error(t("failed_to_fetch_message_templates"));
        showToast(t("failed_to_fetch_templates_from_server"), "error");
      } finally {
        setTemplatesLoading(false);
      }
    };
    fetchTemplates();
  }, [t]);

  // --- جلب المجموعات من API ---
  useEffect(() => {
    const fetchGroups = async () => {
      setGroupsLoading(true);
      try {
        const fetchedGroups = await fetchTemplatesFromAPI1(); // ← تم تغيير المصدر هنا
        setGroups(fetchedGroups);
      } catch (error) {
        console.error(t("failed_to_fetch_groups"));
        showToast(t("failed_to_fetch_groups_from_server"), "error");
      } finally {
        setGroupsLoading(false);
      }
    };
    fetchGroups();
  }, [showGroupDropdown, t]); // ← يمكنك إضافة اعتماد على الحالة إذا كنت تريد إعادة التحميل عند فتح القائمة فقط

  const handleSend = async () => {
    if (!activeAccount) {
      showToast(t("please_select_whatsapp_account_first"), "error");
      return;
    }
    if (recipientNumbers.length === 0 && selectedGroups.length === 0) {
      showToast(t("please_add_recipient_or_group"), "error");
      return;
    }
    if (isTemplateMode && !selectedTemplate) {
      showToast(t("please_select_template"), "error");
      return;
    }
    if (!isTemplateMode && !message.trim()) {
      showToast(t("please_write_message_content"), "error");
      return;
    }
    if (isScheduled && !scheduledTime) {
      showToast(t("please_select_scheduled_time"), "error");
      return;
    }
    if (isScheduled && scheduledTime && scheduledTime <= new Date()) {
      showToast(t("scheduled_time_must_be_in_future"), "error");
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

      let res;
      if (isScheduled) {
        res = await sendWhatsappMessage({
          to: allRecipients,
          message: messageContent,
          scheduledAt: scheduledTime?.toISOString().replace(/\.\d{3}Z$/, "Z"),
        });

        if (res.status === 201) {
          setShowScheduleSuccess(true);
          setTimeout(() => setShowScheduleSuccess(false), 3000);
          showToast(t("message_scheduled_successfully"), "success");
          resetForm();
        } else {
          showToast(t("failed_to_schedule_message"), "error");
        }
      } else {
        res = await sendImmediateMessage({
          to: allRecipients,
          message: messageContent,
        });

        if (res.status === 201) {
          showToast(t("message_sent_successfully"), "success");
          resetForm();
        } else {
          showToast(
            `${t("send_failed")}: ${res.data.message || t("unknown_error")}`,
            "error"
          );
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : t("send_error"));

      showToast(
        `${t(isScheduled ? "scheduling" : "sending")}_error: ${errorMessage}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- اختيار مجموعة ---
  const handleGroupSelect = (group: GroupFromAPI) => {
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
    const trimmed = currentNumber.trim();
    if (!validatePhoneNumber(trimmed)) {
      alert(t("please_enter_valid_phone_number"));
      return;
    }
    if (!recipientNumbers.includes(trimmed)) {
      setRecipientNumbers([...recipientNumbers, trimmed]);
      setCurrentNumber("");
    } else {
      alert(t("number_already_exists"));
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
    return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
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
              {t("whatsapp_message_sender")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isScheduled ? t("scheduled_messages") : t("immediate_messages")}
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
                {t("active_account")}:
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
    </div>
  );
};

export default EnhancedWhatsAppScheduler;
