"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import useLanguage from "@/hooks/useLanguage";
import Table, { TableColumn, TableRow } from "@/components/molecules/Table";
import EditButton from "@/components/common/EditButton";
import DeleteButton from "@/components/common/DeleteButton";
import {
  X,
  Phone,
  MessageSquare,
  Clock,
  Save,
  AlertCircle,
  Eye,
} from "lucide-react";

import {
  getScheduledMessages,
  updateScheduledMessageOnAPI,
  deleteScheduledMessage,
} from "@/services/schedule-massage";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import useTranslation from "@/hooks/useTranslation";

const ScheduledMessagesPage = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessagePreviewOpen, setIsMessagePreviewOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<TableRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    number: "",
    message: "",
    scheduledAt: "",
  });
  const [errors, setErrors] = useState({
    number: "",
    message: "",
    scheduledAt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [scheduledMessages, setScheduledMessages] = useState<TableRow[]>([]);

  // --- جلب البيانات من API ---
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // 🚀 بدء التحميل
      try {
        const data = await getScheduledMessages();
        console.log("data", data);
        const formattedData = data.map((msg: any) => ({
          id: msg._id,
          number: msg.whatsappAccount.phone_number,
          message: msg.message,
          scheduledAt: msg.scheduledTime,
          status: msg.status,
        }));
        setScheduledMessages(formattedData);
      } catch (error) {
        showToast(t("failed_to_fetch_scheduled_messages"), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // --- تنسيق التاريخ ---
  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      // أو "en-US" إذا كنت تريد بالإنجليزية
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- اختصار الرسالة ---
  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength) + "...";
  };

  // --- عرض الرسالة كاملة ---
  const handleShowFullMessage = (message: string) => {
    setPreviewMessage(message);
    setIsMessagePreviewOpen(true);
  };

  // --- إغلاق نافذة المعاينة ---
  const handleClosePreview = () => {
    setIsMessagePreviewOpen(false);
    setPreviewMessage("");
  };

  // --- التحقق من صحة البيانات ---
  const validateForm = () => {
    const newErrors = {
      number: "",
      message: "",
      scheduledAt: "",
    };
    if (!formData.number.trim()) {
      newErrors.number = t("phone_number_required");
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.number.replace(/\s/g, ""))) {
      newErrors.number = t("invalid_phone_number");
    }
    if (!formData.message.trim()) {
      newErrors.message = t("message_content_required");
    } else if (formData.message.trim().length < 5) {
      newErrors.message = t("message_too_short");
    }
    if (!formData.scheduledAt) {
      newErrors.scheduledAt = t("scheduled_time_required");
    } else if (new Date(formData.scheduledAt) <= new Date()) {
      newErrors.scheduledAt = t("send_time_future");
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // --- حذف رسالة ---
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const success = await deleteScheduledMessage(messageId);
      if (success) {
        setScheduledMessages((prev) =>
          prev.filter((msg) => msg.id !== messageId)
        );
        showToast(t("message_deleted_successfully"), "success");
      } else {
        throw new Error(t("delete_failed"));
      }
    } catch (error) {
      showToast(t("failed_to_delete_message"), "error");
    }
  };

  // --- فتح النافذة وتعبئة البيانات ---
  const handleEditMessage = (message: TableRow) => {
    setEditingMessage(message);
    const date = new Date(message.scheduledAt);
    const localDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    setFormData({
      number: message.number,
      message: message.message,
      scheduledAt: localDateTime,
    });
    setErrors({
      number: "",
      message: "",
      scheduledAt: "",
    });
    setIsModalOpen(true);
  };

  // --- حفظ التعديلات ---
  const handleSaveMessage = async () => {
    if (!validateForm() || !editingMessage) return;
    setIsLoading(true);
    try {
      const scheduledAtISO = new Date(formData.scheduledAt).toISOString();

      const success = await updateScheduledMessageOnAPI(editingMessage.id, {
        message: formData.message,
        scheduledAt: scheduledAtISO,
        recipients: [formData.number],
      });

      if (success) {
        setScheduledMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessage.id
              ? {
                  ...msg,
                  number: formData.number,
                  message: formData.message,
                  scheduledAt: scheduledAtISO,
                }
              : msg
          )
        );
        showToast(t("message_updated_successfully"), "success");
        setIsModalOpen(false);
      } else {
        throw new Error(t("update_failed"));
      }
    } catch (error) {
      showToast(t("failed_to_update_message"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- إغلاق النافذة ---
  const handleCloseModal = () => {
    if (isLoading) return;
    setIsModalOpen(false);
  };

  // --- أعمدة الجدول ---
  const columns: TableColumn[] = [
    { key: "number", label: t("recipient_number"), sortable: true, align: "center" },
    { key: "message", label: t("message_content"), sortable: true },
    {
      key: "scheduledAt",
      label: t("send_time"),
      sortable: true,
      align: "center",
    },
    { key: "actions", label: t("actions"), align: "center" },
  ];

  // --- تحويل البيانات ---
  const formattedData = scheduledMessages.map((msg) => ({
    ...msg,
    scheduledAt: formatScheduledTime(msg.scheduledAt),
    message: (
      <div className="flex items-center gap-2">
        <span className="text-gray-800 dark:text-gray-200">
          {truncateMessage(msg.message)}
        </span>
        {msg.message.length > 50 && (
          <button
            onClick={() => handleShowFullMessage(msg.message)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
            title={t("view_full_message")}
          >
            <Eye className="w-3 h-3" />
            {t("show_full")}
          </button>
        )}
      </div>
    ),
    actions: (
      <div className="flex gap-2">
        <EditButton onClick={() => handleEditMessage(msg)} />
        <DeleteButton onClick={() => handleDeleteMessage(msg.id)} />
      </div>
    ),
  }));

  return (
    <div className="p-6 w-full space-y-8 min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
       {t("Scheduled_messages")}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {t("view_and_edit_scheduled_messages")}
      </p>

      {/* جدول الرسائل */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner message={t("loading_messages")} size="lg" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={formattedData}
          searchable={true}
          filterable={true}
          striped={true}
          hoverable={true}
          emptyMessage={t("no_scheduled_messages")}
        />
      )}

      {/* Modal لمعاينة الرسالة */}
      {isMessagePreviewOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={handleClosePreview}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] flex flex-col transform animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                     {t("message_content")}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                     {t("view_full_message_description")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClosePreview}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto">
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words text-right">
                  {previewMessage}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{t("char_count")}: {previewMessage.length}</span>
                <span>
                  {t("word_count")}:{" "}
                  {
                    previewMessage
                      .trim()
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <div className="flex justify-end">
                <button
                  onClick={handleClosePreview}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal التعديل */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl transform animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {t("edit_scheduled_message")}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t("edit_message_details")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* رقم الهاتف */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-green-600" />
                    {t("recipient_number")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => {
                      setFormData({ ...formData, number: e.target.value });
                      if (errors.number) {
                        setErrors({ ...errors, number: "" });
                      }
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                      errors.number
                        ? "border-red-300 dark:border-red-600 focus:border-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:border-green-500"
                    }`}
                    placeholder="+963987654321"
                    dir="ltr"
                  />
                  {errors.number && (
                    <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.number}
                    </div>
                  )}
                </div>
              </div>

              {/* محتوى الرسالة */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  {t("message_content")}
                  <span className="text-xs text-gray-400">
                    ({formData.message.length}/500)
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.message}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) {
                          setErrors({ ...errors, message: "" });
                        }
                      }
                    }}
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                      errors.message
                        ? "border-red-300 dark:border-red-600 focus:border-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:border-green-500"
                    }`}
                    placeholder={t("write_message_content")}
                  />
                  {errors.message && (
                    <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message}
                    </div>
                  )}
                </div>
              </div>

              {/* وقت الإرسال */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-green-600" />
                  {t("scheduled_send_time")}
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => {
                      setFormData({ ...formData, scheduledAt: e.target.value });
                      if (errors.scheduledAt) {
                        setErrors({ ...errors, scheduledAt: "" });
                      }
                    }}
                    min={new Date(Date.now() + 60000)
                      .toISOString()
                      .slice(0, 16)}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
                      errors.scheduledAt
                        ? "border-red-300 dark:border-red-600 focus:border-red-500"
                        : "border-gray-200 dark:border-gray-600 focus:border-green-500"
                    }`}
                  />
                  {errors.scheduledAt && (
                    <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.scheduledAt}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleSaveMessage}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("saving_changes")}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {t("save_changes")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledMessagesPage;
