"use client";

import React, { useState } from "react";
import Button from "../atoms/Button";
import { ChevronDown, MessageSquare } from "lucide-react";

const FAQSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "كيف يمكنني البدء في استخدام الخدمة؟",
      answer: "يمكنك البدء فوراً بالتسجيل والحصول على مفتاح API الخاص بك. نوفر دليل شامل وأمثلة كاملة للتكامل."
    },
    {
      question: "هل يمكنني استخدام الخدمة مع رقم واتساب تجاري؟",
      answer: "نعم، تدعم خدمتنا جميع أنواع حسابات واتساب بما في ذلك الحسابات التجارية والشخصية."
    },
    {
      question: "هل هناك خطر من حظر حسابي على واتساب؟",
      answer: "خدمتنا مطابقة تماماً لسياسات واتساب ونستخدم تقنيات متقدمة لحماية حسابك من الحظر."
    },
    {
      question: "كيف يمكنني الاستفادة من الفترة التجريبية؟",
      answer: "يمكنك البدء فوراً بالخطة المجانية التي تتيح لك إرسال 100 رسالة شهرياً لاستكشاف جميع المزايا."
    },
    {
      question: "هل يمكنني تكامل الخدمة مع أنظمتي الحالية؟",
      answer: "بالطبع! نوفر واجهة برمجية شاملة مع وثائق مفصلة ومكتبات جاهزة لجميع لغات البرمجة الشائعة."
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            الأسئلة الأكثر شيوعاً
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            إجابات شاملة على أهم الأسئلة التي قد تخطر ببالك
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-6 text-right flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">لم تجد إجابة لسؤالك؟</p>
          <Button variant="success" icon={<MessageSquare />} iconPosition="left">تواصل مع الدعم الفني</Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;