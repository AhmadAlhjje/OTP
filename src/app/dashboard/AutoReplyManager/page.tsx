"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AutoReply } from "@/types/auto-reply";
import { getActiveAccount } from "@/services/my_accounts";
// Organisms
import { HeaderSection } from "@/components/organisms/HeaderSection";
import { ControlsSection } from "@/components/organisms/ControlsSection";
// import { RepliesList } from "@/components/organisms/RepliesList";
// Molecules
import { ModalForm } from "@/components/molecules/ModalForm";
// Atoms
import Toast from "@/components/atoms/Toast";
// API Actions
import {
  fetchAutoRepliesFromAPI,
  addAutoReplyToAPI,
  updateAutoReplyOnAPI,
  deleteAutoReplyFromAPI,
} from "@/services/autoReplyAPI.ts";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/useToast";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import Table from "@/components/molecules/Table";
import { MessagePreviewModal } from "@/components/molecules/MessagePreviewModal";
import { MessageContent } from "@/components/molecules/MessageContent";
import EditButton from "@/components/common/EditButton";
import DeleteButton from "@/components/common/DeleteButton";

const AutoReplyManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [editingReply, setEditingReply] = useState<AutoReply | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    keywords: [] as string[],
    response: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMessagePreviewOpen, setIsMessagePreviewOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");
  const [activeAccount, setActiveAccount] = useState<any>(null);

  const { showToast } = useToast();
  const { t } = useTranslation();

  //  جلب البيانات من السيرفر عند التحميل الأولي
  useEffect(() => {
    const loadRepliesAndAccount = async () => {
      setIsLoading(true);
      try {
        // جلب البيانات
        const replies = await fetchAutoRepliesFromAPI();
        setAutoReplies(replies);

        // جلب الحساب النشط
        const account = await getActiveAccount();
        if (account?.id) {
          setActiveAccount(account);
        }
      } catch (error) {
        console.error("فشل في تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    loadRepliesAndAccount();
  }, []);

  //  فتح نافذة الإضافة
  const handleNewReply = () => {
    if (!activeAccount) {
      showToast(t("select_whatsapp_account_first"), "error");
      return;
    }

    setEditingReply(null);
    setFormData({ keywords: [], response: "" }); // ✅ تصحيح
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleEditReply = (reply: AutoReply) => {
    if (!activeAccount) {
      showToast(t("select_whatsapp_account_first"), "error");
      return;
    }

    setEditingReply(reply);
    setFormData({ keywords: reply.keywords, response: reply.response }); // ✅ تصحيح هنا
    setIsModalOpen(true);
  };

  //  حفظ الرد (إضافة أو تعديل)
  const handleSaveReply = async () => {
    if (formData.keywords.length === 0 || !formData.response.trim()) return;

    setIsLoading(true);

    const isEdit = !!editingReply;

    try {
      if (isEdit) {
        // تعديل
        const updatedReply = await updateAutoReplyOnAPI(
          editingReply._id,
          formData
        );
        if (updatedReply) {
          setAutoReplies((prev) =>
            prev.map((r) => (r._id === editingReply._id ? updatedReply : r))
          );
        }
      } else {
        // إضافة
        const newReply = await addAutoReplyToAPI(formData);
        if (newReply) {
          setAutoReplies((prev) => [newReply, ...prev]);
        }
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setIsModalOpen(false);
      setFormData({ keywords: [], response: "" });
    } catch (error: any) {
      console.error("فشل في تنفيذ العملية:", error);

      // استخراج رسالة الخطأ من الـ API إن وُجدت
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        t("auto_reply_operation_failed");

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  //  حذف الرد
  const handleDeleteReply = async (id: string) => {
    setIsLoading(true);

    try {
      const success = await deleteAutoReplyFromAPI(id);
      if (success) {
        setAutoReplies((prev) => prev.filter((reply) => reply._id !== id));
        showToast(t("auto_reply_deleted_successfully"), "success");
      } else {
        throw new Error("فشل في حذف الرد");
      }
    } catch (error) {
      console.error("فشل في الحذف");
      showToast(t("auto_reply_delete_failed"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // لفتح معاينة الرسالة
  const handleShowFullMessage = (message: string) => {
    setPreviewMessage(message);
    setIsMessagePreviewOpen(true);
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      {/* Header Section */}
      <HeaderSection
        title={t("auto_replies")}
        description={t("auto_reply_management")}
        itemCount={autoReplies.length}
        itemLabel={t("auto_reply")}
      />

      {/* Controls Section */}
      <ControlsSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddReply={handleNewReply}
      />

      {/* Replies List */}
      {/* استخدام الجدول لعرض البيانات */}
      <Table
        columns={[
          {
            key: "keywords",
            label: t("keyword"),
            sortable: true,
            align: "right",
          },
          {
            key: "response",
            label: t("response"),
            sortable: true,
            align: "right",
          },
          {
            key: "actions",
            label: t("actions"),
            align: "center",
          },
        ]}
        data={autoReplies.map((reply) => ({
          keywords: reply.keywords.join(", "),
          response: (
            <MessageContent
              message={reply.response}
              onShowFullMessage={() => handleShowFullMessage(reply.response)}
            />
          ),
          actions: (
            <div className="flex justify-center gap-3">
              <EditButton
                onClick={() => {
                  handleEditReply(reply);
                }}
              />
              <DeleteButton
                onClick={() => {
                  handleDeleteReply(reply._id!);
                }}
              />
            </div>
          ),
        }))}
        searchable={true}
        emptyMessage={t("no_auto_replies")}
        loading={isLoading}
      />

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-20 w-full"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalForm
                isEditing={!!editingReply}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSaveReply}
                onClose={() => setIsModalOpen(false)}
                isLoading={isLoading}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showSuccess && (
          <Toast
            id="save-success"
            message={t("changes_saved_successfully")}
            type="success"
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner
            message={t("adding_auto_reply")}
            size="md"
            color="green"
          />
        </div>
      )}

      {/* Modal معاينة الرسالة */}
      <MessagePreviewModal
        isOpen={isMessagePreviewOpen}
        message={previewMessage}
        onClose={() => setIsMessagePreviewOpen(false)}
      />
    </div>
  );
};

export default AutoReplyManager;
