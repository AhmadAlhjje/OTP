"use client";

import React, { useState } from "react";
import Button from "../atoms/Button";
import { ChevronDown, MessageSquare } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

const FAQSection = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: t("faqhow_to_start"),
      answer: t("faqhow_to_start_desc"),
    },
    {
      question: t("faqcan_use_business_account"),
      answer: t("faqcan_use_business_account_desc"),
    },
    {
      question: t("faqblock_risk"),
      answer: t("faqblock_risk_desc"),
    },
    {
      question: t("faqtrial_benefits"),
      answer: t("faqtrial_benefits_desc"),
    },
    {
      question: t("faqintegration_with_systems"),
      answer: t("faqintegration_with_systems_desc"),
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* رأس القسم */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t("faqcommon_questions")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
            {t("faqcomprehensive_answers")}
          </p>
        </div>

        {/* قائمة الأسئلة */}
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
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* زر التواصل مع الدعم الفني */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("faqno_answer")}
          </p>
          <Button
            variant="success"
            icon={<MessageSquare />}
            iconPosition="left"
            className="dark:from-green-600 dark:to-emerald-600"
          >
            {t("faqcontact_support")}
          </Button>
        </div>
      </div>
    </section>
)}

export default FAQSection;