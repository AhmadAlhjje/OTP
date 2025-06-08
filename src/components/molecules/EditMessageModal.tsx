import { useState } from "react";
import {
  X,
  Phone,
  MessageSquare,
  Clock,
  Save,
  AlertCircle,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { TableRow } from "./Table";

interface EditMessageModalProps {
  isOpen: boolean;
  message: TableRow; // استخدم نفس نوع TableRow هنا
  onClose: () => void;
  onSave: (data: {
    number: string;
    message: string;
    scheduledAt: string;
  }) => Promise<void>;
}

export const EditMessageModal = ({
  isOpen,
  message,
  onClose,
  onSave,
}: EditMessageModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    number: message.number,
    message: message.message,
    scheduledAt: message.scheduledAt,
  });
  const [errors, setErrors] = useState({
    number: "",
    message: "",
    scheduledAt: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await onSave(formData);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
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
              onClick={onClose}
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
                min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
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
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSave}
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
  );
};
