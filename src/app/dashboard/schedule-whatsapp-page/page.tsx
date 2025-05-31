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
} from "lucide-react";

import {
  getScheduledMessages,
  updateScheduledMessageOnAPI,
  deleteScheduledMessage,
} from "@/services/schedule-massage";

const ScheduledMessagesPage = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<TableRow | null>(null);
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
      try {
        const data = await getScheduledMessages();

        const formattedData = data.map((msg: any) => ({
          id: msg._id,
          number: msg.recipients[0],
          message: msg.message,
          scheduledAt: msg.scheduledTime,
          status: msg.status,
        }));

        setScheduledMessages(formattedData);
      } catch (error) {
        showToast("فشل في جلب الرسائل المجدولة", "error");
      }
    };

    fetchMessages();
  }, []);

  // --- تنسيق التاريخ ---
  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- التحقق من صحة البيانات ---
  const validateForm = () => {
    const newErrors = {
      number: "",
      message: "",
      scheduledAt: "",
    };
    if (!formData.number.trim()) {
      newErrors.number = "رقم الهاتف مطلوب";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.number.replace(/\s/g, ""))) {
      newErrors.number = "رقم الهاتف غير صحيح";
    }
    if (!formData.message.trim()) {
      newErrors.message = "محتوى الرسالة مطلوب";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "الرسالة قصيرة جداً (الحد الأدنى 5 أحرف)";
    }
    if (!formData.scheduledAt) {
      newErrors.scheduledAt = "وقت الإرسال مطلوب";
    } else if (new Date(formData.scheduledAt) <= new Date()) {
      newErrors.scheduledAt = "يجب أن يكون وقت الإرسال في المستقبل";
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
        showToast("تم حذف الرسالة بنجاح", "success");
      } else {
        throw new Error("فشل في الحذف");
      }
    } catch (error) {
      showToast("فشل في حذف الرسالة", "error");
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
        scheduledAt: scheduledAtISO, // ← تم التصحيح هنا
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
        showToast("تم تحديث الرسالة بنجاح", "success");
        setIsModalOpen(false);
      } else {
        throw new Error("فشل في التحديث");
      }
    } catch (error) {
      showToast("فشل في تحديث الرسالة", "error");
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
    {
      key: "id",
      label: "تحديد",
      sortable: false,
      align: "center",
      width: "60px",
    },
    { key: "number", label: "رقم المستقبل", sortable: true, align: "center" },
    { key: "message", label: "محتوى الرسالة", sortable: true },
    {
      key: "scheduledAt",
      label: "وقت الإرسال",
      sortable: true,
      align: "center",
    },
    { key: "actions", label: "الإجراءات", align: "center" },
  ];

  // --- تحويل البيانات ---
  const formattedData = scheduledMessages.map((msg) => ({
    ...msg,
    scheduledAt: formatScheduledTime(msg.scheduledAt),
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
        الرسائل المجدولة
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        عرض وتعديل الرسائل المجدولة
      </p>

      {/* جدول الرسائل */}
      <Table
        columns={columns}
        data={formattedData}
        searchable={true}
        filterable={true}
        striped={true}
        hoverable={true}
        emptyMessage="لا توجد رسائل مجدولة"
        loading={false}
      />

      {/* Modal */}
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
                      تعديل الرسالة المجدولة
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      قم بتعديل محتوى وتوقيت الرسالة
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
                  رقم المستقبل
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
                  محتوى الرسالة
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
                    placeholder="اكتب محتوى الرسالة هنا..."
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
                  وقت الإرسال المجدول
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
                  إلغاء
                </button>
                <button
                  onClick={handleSaveMessage}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
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
