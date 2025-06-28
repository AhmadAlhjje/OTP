"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import useLanguage from "@/hooks/useLanguage";
import { Table} from "@/components/molecules/Table";
import { TableColumn, TableRow } from "@/types/auto-reply";
import EditButton from "@/components/common/EditButton";
import DeleteButton from "@/components/common/DeleteButton";
import { MessagePreviewModal } from "@/components/molecules/MessagePreviewModal";
import { EditMessageModal } from "@/components/molecules/EditMessageModal";
import { MessageContent } from "@/components/molecules/MessageContent";
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
  const [scheduledMessages, setScheduledMessages] = useState<TableRow[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
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

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleShowFullMessage = (message: string) => {
    setPreviewMessage(message);
    setIsMessagePreviewOpen(true);
  };

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

  const handleEditMessage = (message: TableRow) => {
    setEditingMessage(message);
    const date = new Date(message.scheduledAt);
    const localDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    setIsModalOpen(true);
  };

  const handleSaveMessage = async (formData: {
    number: string;
    message: string;
    scheduledAt: string;
  }) => {
    if (!editingMessage) return;

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
    }
  };

  const columns: TableColumn[] = [
    {
      key: "number",
      label: t("recipient_number"),
      sortable: true,
      align: "center",
    },
    { key: "message", label: t("message_content"), sortable: true },
    {
      key: "scheduledAt",
      label: t("send_time"),
      sortable: true,
      align: "center",
    },
    { key: "actions", label: t("actions"), align: "center" },
  ];

  const formattedData = scheduledMessages.map((msg) => ({
    ...msg,
    scheduledAt: formatScheduledTime(msg.scheduledAt),
    message: (
      <MessageContent
        message={msg.message}
        onShowFullMessage={() => handleShowFullMessage(msg.message)}
      />
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

      {/* Modal معاينة الرسالة */}
      <MessagePreviewModal
        isOpen={isMessagePreviewOpen}
        message={previewMessage}
        onClose={() => setIsMessagePreviewOpen(false)}
      />

      {/* Modal تعديل الرسالة */}
      {editingMessage && (
        <EditMessageModal
          isOpen={isModalOpen}
          message={editingMessage}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMessage}
        />
      )}
    </div>
  );
};

export default ScheduledMessagesPage;
