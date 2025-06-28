"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";

// Types
import { AutoReply, ReplyGroup, TableColumn } from "@/types/auto-reply";

// Components
import { Table } from "@/components/molecules/Table";
import { ModalForm } from "@/components/molecules/ModalForm";
import { MessageContent } from "@/components/molecules/MessageContent";
import { MessagePreviewModal } from "@/components/molecules/MessagePreviewModal";

// Services
import {
  fetchAutoRepliesFromAPI,
  addAutoReplyToAPI,
  updateAutoReplyOnAPI,
  deleteAutoReplyFromAPI,
} from "@/services/autoReplyAPI.ts";

// Hooks (you might need to implement these)
// import useTranslation from "@/hooks/useTranslation";
// import { useToast } from "@/hooks/useToast";

const AutoReplyManager: React.FC = () => {
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [editingReply, setEditingReply] = useState<AutoReply | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ReplyGroup[]>([
    { keywords: [], response: "" },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMessagePreviewOpen, setIsMessagePreviewOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");

  // Hooks (uncomment when available)
  // const { showToast } = useToast();
  // const { t } = useTranslation();

  // Mock translation function - replace with actual implementation
  const t = (key: string) => {
    const translations: { [key: string]: string } = {
      auto_replies: "الردود التلقائية",
      auto_reply_management: "إدارة الردود التلقائية لرسائل العملاء",
      auto_reply_deleted_successfully: "تم حذف الرد التلقائي بنجاح",
      auto_reply_delete_failed: "فشل في حذف الرد التلقائي",
      changes_saved_successfully: "تم حفظ التغييرات بنجاح",
      no_auto_replies: "لا توجد ردود تلقائية حالياً",
      keyword: "الكلمات المفتاحية",
      response: "الرد",
      actions: "الإجراءات",
    };
    return translations[key] || key;
  };

  // Mock toast function - replace with actual implementation
  const showToast = (message: string, type: "success" | "error") => {
    console.log(`${type}: ${message}`);
  };

  // Load data on component mount
  useEffect(() => {
    const loadReplies = async () => {
      setIsLoading(true);
      try {
        const replies = await fetchAutoRepliesFromAPI();
        setAutoReplies(replies);
      } catch (error) {
        console.error("فشل في تحميل البيانات:", error);
        showToast("فشل في تحميل البيانات", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadReplies();
  }, []);

  // Handlers
  const handleNewReply = () => {
    setEditingReply(null);
    setFormData([{ keywords: [], response: "" }]);
    setIsModalOpen(true);
  };

  const handleEditReply = (reply: AutoReply) => {
    setEditingReply(reply);
    setFormData([{ keywords: reply.keywords, response: reply.response }]);
    setIsModalOpen(true);
  };

  const handleSaveReply = async () => {
    const validReplies = formData.filter(
      (r) => r.keywords.length > 0 && r.response.trim() !== ""
    );

    if (validReplies.length === 0) {
      showToast("يجب إضافة كلمة مفتاحية واحدة على الأقل ونص الرد", "error");
      return;
    }

    setIsLoading(true);

    try {
      if (editingReply) {
        // Update existing reply
        const updatedReply = await updateAutoReplyOnAPI(
          editingReply._id!,
          validReplies[0] as any // For editing, we only take the first group
        );

        if (updatedReply) {
          setAutoReplies((prev) =>
            prev.map((r) => (r._id === editingReply._id ? updatedReply : r))
          );
        }
      } else {
        // Add new replies
        const newReplies = await addAutoReplyToAPI(validReplies);

        if (newReplies) {
          setAutoReplies((prev) => [...newReplies, ...prev]);
        }
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsModalOpen(false);
      setFormData([{ keywords: [], response: "" }]);

      showToast(t("changes_saved_successfully"), "success");
    } catch (error: any) {
      console.error("فشل في تنفيذ العملية:", error);

      const errorMessage = error?.message || "فشل في العملية";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReply = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرد التلقائي؟")) {
      return;
    }

    try {
      const success = await deleteAutoReplyFromAPI(id);

      if (success) {
        setAutoReplies((prev) => prev.filter((reply) => reply._id !== id));
        showToast(t("auto_reply_deleted_successfully"), "success");
      }
    } catch (error) {
      console.error("فشل في الحذف:", error);
      showToast(t("auto_reply_delete_failed"), "error");
    }
  };

  const handleShowFullMessage = (message: string) => {
    setPreviewMessage(message);
    setIsMessagePreviewOpen(true);
  };

  // Table configuration
  const columns: TableColumn[] = [
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
      width: "150px",
    },
  ];

  const tableData = autoReplies.map((reply) => ({
    keywords: reply.keywords.join("، "),
    response: (
      <MessageContent
        message={reply.response}
        onShowFullMessage={() => handleShowFullMessage(reply.response)}
      />
    ),
    actions: (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleEditReply(reply)}
          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
          title="تعديل"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => handleDeleteReply(reply._id!)}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          title="حذف"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {t("auto_replies")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t("auto_reply_management")}
              </p>
              <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                إجمالي الردود: {autoReplies.length}
              </div>
            </div>
            <button
              onClick={handleNewReply}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={20} />
              إضافة رد جديد
            </button>
          </div>
        </div>

        {/* Main Table */}
        <Table
          columns={columns}
          data={tableData}
          loading={isLoading}
          emptyMessage={t("no_auto_replies")}
          searchable={true}
        />

        {/* Modal Form */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[95vh] overflow-hidden"
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

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.8 }}
              className="fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {t("changes_saved_successfully")}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Preview Modal */}
        <MessagePreviewModal
          isOpen={isMessagePreviewOpen}
          message={previewMessage}
          onClose={() => setIsMessagePreviewOpen(false)}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  جاري المعالجة...
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AutoReplyManager;
