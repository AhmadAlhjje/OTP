/**
 * AutoReplyManager.tsx
 *
 * الصفحة الرئيسية لإدارة الردود التلقائية.
 * تحتوي على:
 * - رأس الصفحة
 * - شريط البحث وزر إضافة رد جديد
 * - قائمة الردود التلقائية
 * - نافذة منبثقة لإضافة/تعديل الرد
 * - إشعار عند الحفظ بنجاح
 */
"use client";

import React, { useState } from "react";

// Organisms
import { HeaderSection } from "@/components/organisms/HeaderSection";
import { ControlsSection } from "@/components/organisms/ControlsSection";
import { RepliesList } from "@/components/organisms/RepliesList";

// Molecules
import { ModalForm } from "@/components/molecules/ModalForm";

// Atoms
import Toast from "@/components/atoms/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Zap } from "lucide-react";

// Mock data for demonstration
const mockAutoReplies = [
  {
    id: 1,
    keyword: "pricing",
    response:
      "Our pricing starts at $9.99/month. For more details, please visit our website at example.com/pricing",
  },
  {
    id: 2,
    keyword: "support",
    response:
      "للحصول على الدعم الفني، يرجى زيارة support.example.com أو الاتصال على الرقم التالي: +966123456789",
  },
  {
    id: 3,
    keyword: "hours",
    response: "ساعات العمل: من الأحد إلى الخميس من 9 صباحاً إلى 6 مساءً",
  },
];

interface AutoReply {
  id: number;
  keyword: string;
  response: string;
}

export const AutoReplyManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>(mockAutoReplies);
  const [editingReply, setEditingReply] = useState<AutoReply | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ keyword: "", response: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle opening modal for new reply
  const handleNewReply = () => {
    setEditingReply(null);
    setFormData({ keyword: "", response: "" });
    setIsModalOpen(true);
  };

  // Handle opening modal for editing
  const handleEditReply = (reply: AutoReply) => {
    setEditingReply(reply);
    setFormData({ keyword: reply.keyword, response: reply.response });
    setIsModalOpen(true);
  };

  // Handle saving reply
  const handleSaveReply = async () => {
    if (!formData.keyword.trim() || !formData.response.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingReply) {
      // Update existing reply
      setAutoReplies((prev) =>
        prev.map((reply) =>
          reply.id === editingReply.id
            ? {
                ...reply,
                keyword: formData.keyword,
                response: formData.response,
              }
            : reply
        )
      );
    } else {
      // Add new reply
      const newReply = {
        id: Date.now(),
        keyword: formData.keyword,
        response: formData.response,
      };
      setAutoReplies((prev) => [...prev, newReply]);
    }

    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setIsModalOpen(false);
    setFormData({ keyword: "", response: "" });
  };

  // Handle deleting reply
  const handleDeleteReply = (id: number) => {
    setAutoReplies((prev) => prev.filter((reply) => reply.id !== id));
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      {/* Header Section */}
      <HeaderSection
        title="الردود التلقائية"
        description="إدارة الردود الآلية للرسائل الواردة"
        itemCount={autoReplies.length}
        itemLabel="رد تلقائي"
        icon={<Bot />}
        statusIcon={<Zap />}
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
      {showSuccess && (
        <Toast
          id="save-success"
          message="تم الحفظ بنجاح!"
          type="success"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default AutoReplyManager;
