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


export const AutoReplyManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [editingReply, setEditingReply] = useState<AutoReply | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ keyword: "", response: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

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
      const updatedReply = await updateAutoReplyOnAPI(
        editingReply.id,
        formData
      );
      if (updatedReply) {
        setAutoReplies((prev) =>
          prev.map((r) => (r.id === editingReply.id ? updatedReply : r))
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
  const handleDeleteReply = async (id: number) => {
    const success = await deleteAutoReplyFromAPI(id);
    if (success) {
      setAutoReplies((prev) => prev.filter((reply) => reply.id !== id));
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      {/* Header Section */}
      <HeaderSection
        title="الردود التلقائية"
        description="إدارة الردود الآلية للرسائل الواردة"
        itemCount={autoReplies.length}
        itemLabel="رد تلقائي"
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
        title="قائمة الردود التلقائية"
        emptySearchText="لا توجد نتائج للبحث"
        emptyDefaultText="لا توجد ردود تلقائية"
        emptySearchSuggestion="جرب البحث بكلمات مختلفة"
        emptyDefaultActionText="أضف ردود تلقائية للبدء في استخدام الميزة"
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
            message="تم الحفظ بنجاح!"
            type="success"
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoReplyManager;
