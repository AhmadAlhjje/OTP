"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/textarea";
import { getActiveAccount } from "@/services/my_accounts";
import AccountSwitcher from "@/components/atoms/AccountSwitcher";
import useLanguage from "@/hooks/useLanguage";
import Button from "@/components/atoms/Button";
import { useToast } from "@/hooks/useToast";
import { sendWhatsappMessage } from "@/services/message-service";
import { sendWhatsappMessage as sendScheduledMessage } from "@/services/schedule-massage";
import { fetchTemplatesFromAPI } from "@/services/templateMassageService"; 
import {
  Phone,
  Send,
  X,
  MessageSquare,
  Info,
  Clock,
  Calendar,
  Timer,
  Sparkles,
  CheckCircle2,
  FileText,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AxiosResponse } from "axios";

// استيراد DateTime Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface WhatsAppMessageResponse extends AxiosResponse {
  message?: string;
}

// Interface for API Template
interface APITemplate {
  id: string;
  name: string;
  content: string;
  category?: string;
}

const EnhancedWhatsAppScheduler = () => {
  const [activeAccount, setActiveAccount] = useState<any>(null);
  const [currentNumber, setCurrentNumber] = useState("");
  const [recipientNumbers, setRecipientNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [showScheduleSuccess, setShowScheduleSuccess] = useState(false);

  // Template related states
  const [templates, setTemplates] = useState<APITemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<APITemplate | null>(
    null
  );
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const { language } = useLanguage();
  const { showToast } = useToast();
  const isRTL = language === "ar";

  // --- التحميل الأولي للحساب النشط ---
  useEffect(() => {
    const fetchActive = async () => {
      const acc = await getActiveAccount();
      setActiveAccount(acc);
    };
    fetchActive();
  }, []);

  // --- جلب القوالب من API ---
  useEffect(() => {
    const fetchTemplates = async () => {
      setTemplatesLoading(true);
      try {
        const fetchedTemplates = await fetchTemplatesFromAPI(); // ← هذه تُرجع TemplateFromAPI[]

        // هنا نقوم بالتحويل إلى APITemplate[]
        const normalizedTemplates = fetchedTemplates.map((template) => ({
          id: template._id,
          name: template.name,
          content: template.message,
        }));

        setTemplates(normalizedTemplates); // ✅ الآن سيكون النوع صحيحًا
      } catch (error) {
        showToast("فشل في جلب قوالب الرسائل", "error");
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // --- التحقق من صحة رقم الهاتف ---
  const validatePhoneNumber = (number: string) => {
    const trimmed = number.trim();
    return trimmed.length >= 10 && /^\+?\d+$/.test(trimmed);
  };

  // --- إضافة رقم هاتف إلى القائمة ---
  const handleAddNumber = () => {
    const trimmed = currentNumber.trim();
    if (!validatePhoneNumber(trimmed)) {
      showToast("يرجى إدخال رقم هاتف صحيح", "error");
      return;
    }
    if (!recipientNumbers.includes(trimmed)) {
      setRecipientNumbers([...recipientNumbers, trimmed]);
      setCurrentNumber("");
    } else {
      showToast("هذا الرقم موجود بالفعل في القائمة", "warning");
    }
  };

  // --- إضافة رقم عند الضغط على Enter ---
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentNumber.trim()) {
      e.preventDefault();
      handleAddNumber();
    }
  };

  // --- حذف رقم من قائمة المستقبلين ---
  const handleRemoveNumber = (number: string) => {
    setRecipientNumbers(recipientNumbers.filter((n) => n !== number));
  };

  // --- اختيار قالب رسالة ---
  const handleTemplateSelect = (template: APITemplate) => {
    setSelectedTemplate(template);
    setMessage(template.content);
    setShowTemplateDropdown(false);
  };

  // --- تبديل وضع القالب ---
  const handleTemplateModeToggle = () => {
    setIsTemplateMode(!isTemplateMode);
    if (!isTemplateMode) {
      // إذا تم تفعيل وضع القالب، امسح الرسالة المكتوبة يدوياً
      setMessage("");
      setSelectedTemplate(null);
    } else {
      // إذا تم إلغاء وضع القالب، امسح القالب المحدد
      setSelectedTemplate(null);
    }
  };

  // --- معالجة إرسال الرسالة (مجدولة أو فورية) ---
  const handleSend = async () => {
    if (!activeAccount) {
      showToast("يرجى اختيار حساب واتساب أولاً", "error");
      return;
    }
    if (recipientNumbers.length === 0) {
      showToast("يرجى إضافة رقم مستلم واحد على الأقل", "error");
      return;
    }

    // التحقق من وجود رسالة أو قالب محدد
    if (isTemplateMode && !selectedTemplate) {
      showToast("يرجى اختيار قالب رسالة", "error");
      return;
    }
    if (!isTemplateMode && !message.trim()) {
      showToast("يرجى كتابة نص الرسالة", "error");
      return;
    }

    if (isScheduled && !scheduledTime) {
      showToast("يرجى اختيار وقت الإرسال المجدول", "error");
      return;
    }
    if (isScheduled && scheduledTime && scheduledTime <= new Date()) {
      showToast("يجب أن يكون وقت الإرسال في المستقبل", "error");
      return;
    }

    setIsLoading(true);

    try {
      // تحديد محتوى الرسالة بناءً على الوضع
      const messageContent = isTemplateMode
        ? selectedTemplate?.id || ""
        : message;

      if (isScheduled) {
        // إرسال مجدول
        const res = await sendScheduledMessage({
          to: recipientNumbers,
          message: messageContent,
          scheduledAt: scheduledTime?.toISOString().replace(/\.\d{3}Z$/, "Z"),
        });
        if (res.status === 201) {
          setShowScheduleSuccess(true);
          setTimeout(() => setShowScheduleSuccess(false), 3000);
          showToast("تم جدولة الرسالة بنجاح ✨", "success");
          resetForm();
        } else {
          showToast("فشل في جدولة الرسالة", "error");
        }
      } else {
        // إرسال فوري
        const res = (await sendWhatsappMessage({
          to: recipientNumbers,
          message: messageContent,
        })) as WhatsAppMessageResponse;
        if (res.status === 201) {
          showToast("تم إرسال الرسالة بنجاح 🚀", "success");
          resetForm();
        } else {
          showToast(
            "فشل في الإرسال: " + (res.message || "خطأ غير معروف"),
            "error"
          );
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : "خطأ غير معروف");
      showToast(
        `حدث خطأ أثناء ${isScheduled ? "الجدولة" : "الإرسال"}: ${errorMessage}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- إعادة تعيين الحقول بعد الإرسال ---
  const resetForm = () => {
    setRecipientNumbers([]);
    setMessage("");
    setScheduledTime(null);
    setIsScheduled(false);
    setSelectedTemplate(null);
    setIsTemplateMode(false);
  };

  // --- تحديد أقل وقت ممكن للجدولة (5 دقائق من الآن) ---
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // الحد الأدنى 5 دقائق من الآن
    return now;
  };

  // --- تنسيق عرض الوقت والتاريخ ---
  const formatScheduledTime = (date: Date) => {
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-6 w-full space-y-8 min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      {/* رأس الصفحة المحسن */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
            {isScheduled && (
              <Clock className="absolute -top-1 -right-1 h-4 w-4 text-orange-500 animate-pulse" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              إرسال رسائل واتساب
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isScheduled ? "إرسال مجدول للرسائل" : "إرسال فوري للرسائل"}
            </p>
          </div>
        </div>

        {activeAccount && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 px-5 py-3 rounded-xl shadow-lg border border-green-200 dark:border-green-700"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">الحساب النشط:</span>
              <span className="font-bold">{activeAccount.name}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* محتوى رئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* القسم الأيسر - إدخال البيانات */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* تبديل وضع الجدولة */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isScheduled
                      ? "bg-orange-100 dark:bg-orange-900/30"
                      : "bg-green-100 dark:bg-green-900/30"
                  }`}
                >
                  {isScheduled ? (
                    <Timer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  ) : (
                    <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {isScheduled ? "الإرسال المجدول" : "الإرسال الفوري"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isScheduled
                      ? "اختر وقت مناسب للإرسال"
                      : "إرسال الرسالة الآن"}
                  </p>
                </div>
              </div>

              <motion.label
                className="relative inline-flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`relative w-14 h-7 transition-colors duration-300 rounded-full ${
                    isScheduled
                      ? "bg-gradient-to-r from-orange-400 to-orange-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
                    animate={{ x: isScheduled ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {isScheduled ? (
                      <Timer className="h-3 w-3 text-orange-600" />
                    ) : (
                      <Send className="h-3 w-3 text-green-600" />
                    )}
                  </motion.div>
                </div>
              </motion.label>
            </div>
          </motion.div>

          {/* قسم اختيار الوقت المجدول */}
          <AnimatePresence>
            {isScheduled && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-2xl shadow-lg border border-orange-200/50 dark:border-orange-700/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                    <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      تحديد وقت الإرسال
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      اختر التاريخ والوقت المناسب
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <DatePicker
                    selected={scheduledTime}
                    onChange={(date: Date | null) => setScheduledTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy/MM/dd HH:mm"
                    minDate={getMinDateTime()}
                    className="w-full p-4 border-2 border-orange-200 dark:border-orange-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-center font-medium"
                    placeholderText="اختر تاريخ ووقت الإرسال"
                    popperClassName="z-50"
                  />
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5 pointer-events-none" />
                </div>

                {scheduledTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-orange-200 dark:border-orange-700"
                  >
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        سيتم الإرسال في: {formatScheduledTime(scheduledTime)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* إدخال رقم المستقبل */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    أرقام المستقبلين
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    أضف أرقام الهواتف بالصيغة الدولية
                  </p>
                </div>
              </div>

              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info
                  size={20}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors"
                />
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl z-20"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">تنسيق رقم الهاتف:</p>
                        <p>• ابدأ برمز البلد (+966 للسعودية)</p>
                        <p>• مثال: +963912345678</p>
                        <p>• لا تستخدم مسافات أو رموز أخرى</p>
                      </div>
                      <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-3">
              <Input
                type="text"
                value={currentNumber}
                onChange={(e) => setCurrentNumber(e.target.value)}
                placeholder="مثال: +963912345678"
                onKeyPress={handleKeyPress}
                className="flex-1 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 rounded-xl"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAddNumber}
                  variant="success"
                  className="h-12 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg flex items-center gap-2 transition-all"
                >
                  <span>إضافة</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* حقل كتابة محتوى الرسالة مع اختيار القوالب */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    محتوى الرسالة
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isTemplateMode ? "اختر قالب رسالة" : "اكتب رسالتك"}
                  </p>
                </div>
              </div>

              {/* تبديل وضع القالب */}
              <motion.label
                className="relative inline-flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  type="checkbox"
                  checked={isTemplateMode}
                  onChange={handleTemplateModeToggle}
                  className="sr-only"
                />
                <div
                  className={`relative w-14 h-7 transition-colors duration-300 rounded-full ${
                    isTemplateMode
                      ? "bg-gradient-to-r from-purple-400 to-purple-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
                    animate={{ x: isTemplateMode ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <FileText className="h-3 w-3 text-purple-600" />
                  </motion.div>
                </div>
              </motion.label>
            </div>

            {isTemplateMode ? (
              // عرض اختيار القوالب
              <div className="space-y-4">
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowTemplateDropdown(!showTemplateDropdown)
                    }
                    className="w-full p-4 border-2 border-purple-200 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-right flex items-center justify-between transition-all"
                    disabled={templatesLoading}
                  >
                    <span>
                      {templatesLoading
                        ? "جاري التحميل..."
                        : selectedTemplate
                        ? selectedTemplate.name
                        : "اختر قالب رسالة"}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-purple-500 transition-transform ${
                        showTemplateDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showTemplateDropdown && !templatesLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto"
                      >
                        {templates.length > 0 ? (
                          templates.map((template) => (
                            <motion.button
                              key={template.id}
                              onClick={() => handleTemplateSelect(template)}
                              whileHover={{
                                backgroundColor: "rgba(168, 85, 247, 0.1)",
                              }}
                              className="w-full p-4 text-right hover:bg-purple-50 dark:hover:bg-purple-900/20 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                            >
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  {template.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {template.content}
                                </p>
                                {template.category && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                                    {template.category}
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            لا توجد قوالب متاحة
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* عرض القالب المحدد */}
                {selectedTemplate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-800 dark:text-purple-300">
                        القالب المحدد: {selectedTemplate.name}
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedTemplate(null);
                          setMessage("");
                        }}
                        className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                      {selectedTemplate.content}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-purple-700 dark:text-purple-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        سيتم إرسال معرف القالب: {selectedTemplate.id}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              // عرض كتابة الرسالة اليدوية
              <div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا... يمكنك استخدام الإيموجي والنصوص الطويلة"
                  className="min-h-[180px] resize-none border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl text-base leading-relaxed"
                />

                <div className="flex justify-between items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>{message.length} حرف</span>
                  {message.length > 0 && (
                    <span className="text-green-600 dark:text-green-400">
                      ✓ جاهز للإرسال
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* زر الإرسال المحسن */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className={`w-full py-4 px-8 text-white rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-semibold ${
                isScheduled
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                  <span>
                    {isScheduled ? "جاري الجدولة..." : "جاري الإرسال..."}
                  </span>
                </>
              ) : (
                <>
                  {isScheduled ? <Clock size={20} /> : <Send size={20} />}
                  <span>
                    {isScheduled ? "جدولة الرسالة" : "إرسال الرسالة"}
                    {isTemplateMode && " (قالب)"}
                  </span>
                  {isScheduled && (
                    <Sparkles size={18} className="animate-pulse" />
                  )}
                </>
              )}
            </Button>

            {/* تأثير النجاح للرسائل المجدولة */}
            <AnimatePresence>
              {showScheduleSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center"
                >
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 size={24} />
                    <span className="font-semibold">تم الجدولة بنجاح!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* القسم الأيمن - عرض المستقبلين */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                  قائمة المستقبلين
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  الأرقام المضافة للإرسال
                </p>
              </div>
            </div>

            <motion.span
              key={recipientNumbers.length}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 text-indigo-800 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
            >
              {recipientNumbers.length} رقم
            </motion.span>
          </div>

          {recipientNumbers.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {recipientNumbers.map((number, index) => (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Phone
                        size={16}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {number}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        رقم {index + 1}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveNumber(number)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={18} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
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
                <Phone
                  size={64}
                  strokeWidth={1}
                  className="text-gray-300 dark:text-gray-600"
                />
              </motion.div>
              <p className="mt-4 text-lg font-medium">لا توجد أرقام مضافة</p>
              <p className="text-sm text-center leading-relaxed mt-2">
                أضف أرقام المستقبلين لبدء الإرسال
                <br />
                يمكنك إضافة عدة أرقام للإرسال الجماعي
              </p>
            </div>
          )}

          {/* معلومات إضافية عن الرسالة */}
          {(selectedTemplate || message) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
            >
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                معاينة الإرسال
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    نوع الرسالة: {isTemplateMode ? "قالب جاهز" : "رسالة مخصصة"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    عدد المستقبلين: {recipientNumbers.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    وقت الإرسال: {isScheduled ? "مجدول" : "فوري"}
                  </span>
                </div>
                {isTemplateMode && selectedTemplate && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      معرف القالب: {selectedTemplate.id}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* مبدّل الحسابات */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className={`fixed bottom-6 ${
          language === "ar" ? "left-6" : "right-6"
        } z-50`}
      >
        <div className="bg-white/90 backdrop-blur-md dark:bg-gray-800/90 p-2 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <AccountSwitcher />
        </div>
      </motion.div>

      {/* تأثيرات الخلفية */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/20 dark:bg-green-800/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default EnhancedWhatsAppScheduler;
