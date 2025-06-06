"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AutoReply } from "@/types/auto-reply";

// Organisms
import { HeaderSection } from "@/components/organisms/HeaderSection";
import { ControlsSection } from "@/components/organisms/ControlsSection";
import { RepliesList } from "@/components/organisms/RepliesList";

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

const AutoReplyManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [editingReply, setEditingReply] = useState<AutoReply | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ keyword: "", response: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { t } = useTranslation();

  //  جلب البيانات من السيرفر عند التحميل الأولي
  useEffect(() => {
    const loadReplies = async () => {
      setLoadingData(true);
      const replies = await fetchAutoRepliesFromAPI();
      setAutoReplies(replies);
      setLoadingData(false);
    };
    loadReplies();
  }, []);

  //  فتح نافذة الإضافة
  const handleNewReply = () => {
    setEditingReply(null);
    setFormData({ keyword: "", response: "" });
    setIsModalOpen(true);
  };

  //  فتح نافذة التعديل
  const handleEditReply = (reply: AutoReply) => {
    setEditingReply(reply);
    setFormData({ keyword: reply.keyword, response: reply.response });
    setIsModalOpen(true);
  };

  //  حفظ الرد (إضافة أو تعديل)
  const handleSaveReply = async () => {
    if (!formData.keyword.trim() || !formData.response.trim()) return;

    setIsLoading(true);

    if (editingReply) {
      //  تعديل
      const updatedReply = await updateAutoReplyOnAPI(editingReply._id, formData);
      if (updatedReply) {
        setAutoReplies((prev) =>
          prev.map((r) => (r._id === editingReply._id ? updatedReply : r))
        );
      }
    } else {
      //  إضافة
      const newReply = await addAutoReplyToAPI(formData);
      if (newReply) {
        setAutoReplies((prev) => [newReply, ...prev]);
      }
    }

    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setIsModalOpen(false);
    setFormData({ keyword: "", response: "" });
  };

  //  حذف الرد
  const handleDeleteReply = async (id: string) => {
    const success = await deleteAutoReplyFromAPI(id);
    if (success) {
      setAutoReplies((prev) => prev.filter((reply) => reply._id !== id));
    }
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
      <RepliesList
        replies={autoReplies}
        searchTerm={searchTerm}
        onEdit={handleEditReply}
        onDelete={handleDeleteReply}
        title={t("list_of_auto_replies")}
        emptySearchText={t("no_search_results")}
        emptyDefaultText={t("no_auto_replies")}
        emptySearchSuggestion={t("try_different_keywords")}
        emptyDefaultActionText={t("add_auto_replies_to_start")}
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
    </div>
  );
};

export default AutoReplyManager;
