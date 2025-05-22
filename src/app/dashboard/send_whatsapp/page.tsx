"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/textarea";
import { getActiveAccount } from "@/services/my_accounts";
import AccountSwitcher from "@/components/atoms/AccountSwitcher";
import useLanguage from "@/hooks/useLanguage";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import { useToast } from "@/hooks/useToast";
import { sendWhatsappMessage } from "@/services/message-service";
import { Phone, Send, Plus, X, MessageSquare, Info } from "lucide-react";
import { motion } from "framer-motion";
import { AxiosResponse } from "axios"; // إضافة استيراد Axios Response

interface WhatsAppMessageResponse extends AxiosResponse {
  message?: string;
}

const SendWhatsappPage = () => {
  const [activeAccount, setActiveAccount] = useState<any>(null);
  const [currentNumber, setCurrentNumber] = useState("");
  const [recipientNumbers, setRecipientNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isRTL = language === "ar";

  useEffect(() => {
    const fetchActive = async () => {
      const acc = await getActiveAccount();
      setActiveAccount(acc);
    };
    fetchActive();
  }, []);

  const validatePhoneNumber = (number: string) => {
    // تحقق بسيط من صحة رقم الهاتف (يمكن تعديله حسب متطلبات التطبيق)
    const trimmed = number.trim();
    return trimmed.length >= 10 && /^\+?\d+$/.test(trimmed);
  };

  const handleAddNumber = () => {
    const trimmed = currentNumber.trim();

    if (!validatePhoneNumber(trimmed)) {
      showToast("يرجى إدخال رقم هاتف صحيح", "error");
      return;
    }

    if (!recipientNumbers.includes(trimmed)) {
      // إضافة تأثير حركي عند إضافة الرقم
      setRecipientNumbers([...recipientNumbers, trimmed]);
      setCurrentNumber("");
    } else {
      showToast("هذا الرقم موجود بالفعل في القائمة", "warning");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentNumber.trim()) {
      e.preventDefault();
      handleAddNumber();
    }
  };

  const handleRemoveNumber = (number: string) => {
    setRecipientNumbers(recipientNumbers.filter((n) => n !== number));
  };

  const handleSend = async () => {
    if (!activeAccount) {
      showToast("يرجى اختيار حساب واتساب أولاً", "error");
      return;
    }

    if (recipientNumbers.length === 0) {
      showToast("يرجى إضافة رقم مستلم واحد على الأقل", "error");
      return;
    }

    if (!message.trim()) {
      showToast("يرجى كتابة نص الرسالة", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = (await sendWhatsappMessage({
        fromAccountId: activeAccount.id,
        to: recipientNumbers,
        message,
      })) as WhatsAppMessageResponse;

      if (res.status === 200) {
        showToast("تم إرسال الرسالة بنجاح", "success");
        setRecipientNumbers([]);
        setMessage("");
      } else {
        showToast(
          "فشل في الإرسال: " + (res.message || "خطأ غير معروف"),
          "error"
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "خطأ غير معروف";
      showToast("حدث خطأ أثناء الإرسال: " + errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full space-y-8 min-h-screen bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* رأس الصفحة */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-500 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          <span>إرسال رسالة واتساب</span>
        </h2>

        {activeAccount && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <span>الحساب النشط:</span>
            <span className="font-bold">{activeAccount.name}</span>
          </div>
        )}
      </motion.div>

      {/* محتوى رئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* القسم الأيسر - إدخال البيانات */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* إدخال رقم المستقبل */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Phone size={18} />
                <span>رقم المستقبل</span>
              </label>

              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info size={16} className="text-gray-500 cursor-help" />
                {showTooltip && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10">
                    يرجى إدخال رقم الهاتف بالصيغة الدولية مع رمز البلد، مثل:
                    +966501234567
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2 rtl:space-x-reverse">
              <Input
                type="text"
                value={currentNumber}
                onChange={(e) => setCurrentNumber(e.target.value)}
                placeholder="مثال: +966501234567"
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={handleAddNumber}
                variant="success"
                className="flex items-center gap-2 transition-all h-11"
              >
                {/* <Plus size={18} /> */}
                <span>إضافة</span>
              </Button>
            </div>
          </div>

          {/* حقل كتابة محتوى الرسالة */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <label className="block mb-4 font-medium text-gray-700 dark:text-gray-300 items-center gap-2">
              <MessageSquare size={18} />
              <span>محتوى الرسالة</span>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب الرسالة هنا..."
              className="min-h-[200px] resize-none border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* زر الإرسال */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-3 flex items-center justify-center gap-2 rounded-xl shadow-lg transition-all"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <Send size={18} />
                  <span>إرسال الرسالة</span>
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* القسم الأيمن - عرض المستقبلين */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">
              قائمة المستقبلين
            </h3>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm">
              {recipientNumbers.length} رقم
            </span>
          </div>

          {recipientNumbers.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto p-2">
              {recipientNumbers.map((number, index) => (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900"
                >
                  <div className="flex items-center gap-2">
                    <Phone
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span className="font-medium">{number}</span>
                  </div>
                  <Button
                    onClick={() => handleRemoveNumber(number)}
                    variant="danger"
                    size="sm"
                    icon={<X size={18} />}
                    iconPosition="left"
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full transition-colors" children={undefined}                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
              <Phone size={48} strokeWidth={1} />
              <p className="mt-3">لم تقم بإضافة أي أرقام بعد</p>
              <p className="text-sm">أضف أرقام المستقبلين للرسالة</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* مبدّل الحسابات (يبقى كما هو) */}
      <div
        className={`fixed bottom-4 ${
          language === "ar" ? "left-4" : "right-4"
        } z-50`}
      >
        <AccountSwitcher />
      </div>
    </div>
  );
};

export default SendWhatsappPage;
