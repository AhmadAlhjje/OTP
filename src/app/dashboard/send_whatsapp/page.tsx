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

const SendWhatsappPage = () => {
  const [activeAccount, setActiveAccount] = useState<any>(null);
  // حالة لتخزين الرقم الذي يدخله المستخدم حالياً قبل الإضافة
  const [currentNumber, setCurrentNumber] = useState("");
  // قائمة أرقام المستقبلين المضافة
  const [recipientNumbers, setRecipientNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const { language } = useLanguage();
  const { showToast } = useToast();
  
  // عند تحميل الصفحة للمرة الأولى، جلب الحساب النشط من السيرفر أو الخدمة
  useEffect(() => {
    const fetchActive = async () => {
      const acc = await getActiveAccount();
      setActiveAccount(acc);
    };
    fetchActive();
  }, []);

  // دالة لإضافة رقم جديد إلى قائمة المستقبلين
  const handleAddNumber = () => {
    const trimmed = currentNumber.trim(); // إزالة الفراغات الزائدة
    // التأكد أن الرقم غير فارغ وغير مكرر
    if (trimmed && !recipientNumbers.includes(trimmed)) {
      setRecipientNumbers([...recipientNumbers, trimmed]); // إضافة الرقم للقائمة
      setCurrentNumber(""); // مسح حقل الإدخال بعد الإضافة
    }
  };

  // دالة لحذف رقم معين من قائمة المستقبلين
  const handleRemoveNumber = (number: string) => {
    setRecipientNumbers(recipientNumbers.filter((n) => n !== number));
  };

  // دالة إرسال الرسالة عبر حساب الواتساب النشط إلى كل الأرقام المضافة
  const handleSend = async () => {
    // تحقق من أن كل الحقول مكتملة
    if (!activeAccount || recipientNumbers.length === 0 || !message) {
      showToast("يرجى تعبئة جميع الحقول وإضافة أرقام مستقبلين واختيار حساب", "error");
      return;
    }

    // طباعة البيانات المرسلة في الكونسول لأغراض التطوير
    console.log("البيانات التي سترسلها للباك:");
    console.log({
      fromAccountId: activeAccount.id,
      to: recipientNumbers,
      message,
    });

    try {
      // إرسال الرسالة باستخدام الخدمة
      const res = await sendWhatsappMessage({
        fromAccountId: activeAccount.id,
        to: recipientNumbers,
        message,
      });

      // إظهار رسالة نجاح أو فشل حسب الاستجابة
      if (res.status === 200) {
        showToast("تم إرسال الرسالة بنجاح", "success");
        setRecipientNumbers([]); // إعادة تعيين القائمة بعد الإرسال
        setMessage("");          // مسح محتوى الرسالة
      } else {
        showToast("فشل في الإرسال", "error");
      }
    } catch (error) {
      showToast("حدث خطأ أثناء الإرسال", "error");
    }
  };

  return (
    <div className="p-4 space-y-6 min-h-screen">
      <h2 className="text-xl font-bold">إرسال رسالة واتساب</h2>

      {/* إدخال رقم المستقبل وإضافة الرقم للقائمة */}
      <div>
        <label className="block mb-2 font-medium">رقم المستقبل:</label>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Input
            type="text"
            value={currentNumber}
            onChange={(e) => setCurrentNumber(e.target.value)}
            placeholder="أدخل رقم المستلم"
          />
          <Button onClick={handleAddNumber}>إضافة</Button>
        </div>
      </div>

      {/* عرض أرقام المستقبلين المضافة كبطاقات مع خيار حذف كل رقم */}
      {recipientNumbers.length > 0 && (
        <div>
          <label className="block mb-2 font-medium">الأرقام المُضافة:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recipientNumbers.map((number) => (
              <Card
                key={number}
                title={number}
                content={
                  <button
                    onClick={() => handleRemoveNumber(number)}
                    className="text-red-600 hover:underline text-sm mt-2"
                  >
                    حذف الرقم
                  </button>
                }
                color="green-600"
              />
            ))}
          </div>
        </div>
      )}

      {/* حقل كتابة محتوى الرسالة */}
      <div>
        <label className="block mb-2 font-medium">محتوى الرسالة:</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب الرسالة هنا"
        />
      </div>

      {/* زر الإرسال */}
      <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700 text-white">
        إرسال
      </Button>

      {/* مبدّل الحسابات يظهر في أسفل الصفحة حسب اتجاه اللغة */}
      <div
        className={`fixed bottom-4 ${language === "ar" ? "left-4" : "right-4"} z-50`}
      >
        <AccountSwitcher />
      </div>
    </div>
  );
};

export default SendWhatsappPage;
