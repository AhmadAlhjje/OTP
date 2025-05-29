"use client";
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  Search,
  Save,
  X,
  Bot,
  Zap,
  CheckCircle2,
  AlertCircle,
  Settings,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const AutoReplyManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>(mockAutoReplies);
  const [editingReply, setEditingReply] = useState<AutoReply | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ keyword: "", response: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter auto replies based on search term
  const filteredReplies = autoReplies.filter(
    (reply) =>
      reply.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reply.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    if (!formData.keyword.trim() || !formData.response.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
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
  const handleDeleteReply = async (id: number) => {
    setAutoReplies((prev) => prev.filter((reply) => reply.id !== id));
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full animate-pulse flex items-center justify-center">
              <Zap className="h-2 w-2 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              الردود التلقائية
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              إدارة الردود الآلية للرسائل الواردة
            </p>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <motion.div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 px-5 py-3 rounded-xl shadow-lg border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">نشط:</span>
              <span className="font-bold">{autoReplies.length} رد تلقائي</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                البحث في الردود
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ابحث في الكلمات المفتاحية أو الردود
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن كلمة مفتاحية أو رد..."
              className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Add New Reply Button */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                إضافة رد جديد
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                أنشئ رد تلقائي جديد
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewReply}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={18} />
            <span className="font-medium">إضافة رد تلقائي</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Auto Replies List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                قائمة الردود التلقائية
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredReplies.length} من أصل {autoReplies.length} رد
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredReplies.length > 0 ? (
            <div className="space-y-4">
              {filteredReplies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {reply.keyword}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} />
                          <span>نشط</span>
                        </div>
                      </div>

                      <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {reply.response}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditReply(reply)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteReply(reply.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Bot
                  size={64}
                  strokeWidth={1}
                  className="text-gray-300 dark:text-gray-600"
                />
              </motion.div>
              <p className="mt-4 text-lg font-medium">
                {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد ردود تلقائية"}
              </p>
              <p className="text-sm text-center leading-relaxed mt-2">
                {searchTerm
                  ? "جرب البحث بكلمات مختلفة"
                  : "أضف ردود تلقائية للبدء في استخدام الميزة"}
              </p>
            </div>
          )}
        </div>
      </motion.div>
      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-20"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      {editingReply ? (
                        <Edit3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {editingReply
                          ? "تعديل الرد التلقائي"
                          : "إضافة رد تلقائي جديد"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {editingReply
                          ? "قم بتحديث بيانات الرد"
                          : "أنشئ رد تلقائي للكلمات المفتاحية"}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Keyword Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    الكلمة المفتاحية *
                  </label>
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={formData.keyword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          keyword: e.target.value,
                        }))
                      }
                      placeholder="مثال: pricing, support, hours"
                      className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    الكلمة التي سيبحث عنها النظام في الرسائل الواردة
                  </p>
                </div>

                {/* Response Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    الرد التلقائي *
                  </label>
                  <textarea
                    value={formData.response}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        response: e.target.value,
                      }))
                    }
                    placeholder="اكتب الرد التلقائي الذي سيتم إرساله عند استلام الكلمة المفتاحية..."
                    rows={6}
                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      يمكنك استخدام الإيموجي والنصوص الطويلة
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.response.length} حرف
                    </span>
                  </div>
                </div>

                {/* Preview */}
                {formData.keyword && formData.response && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        معاينة الرد التلقائي
                      </span>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>عند استلام:</strong> "{formData.keyword}"
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        <strong>سيتم الرد بـ:</strong> {formData.response}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveReply}
                  disabled={
                    !formData.keyword.trim() ||
                    !formData.response.trim() ||
                    isLoading
                  }
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editingReply ? "تحديث الرد" : "حفظ الرد"}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-2xl z-50"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} />
              <span className="font-medium">تم الحفظ بنجاح!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/20 dark:bg-green-800/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AutoReplyManager;
