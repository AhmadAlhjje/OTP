"use client";

import React from "react";
import { Phone, Mail, MessageSquare, MessageCircle } from "lucide-react";
import Button from "../atoms/Button";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-white dark:bg-[#202a30] text-center"
    >
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          هل ترغب بتفعيل رسائل واتساب تلقائية؟
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-10">
          يسعدنا دعمك في ذلك.
        </p>

        {/* البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* بطاقة 1 */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition text-center">
            <Phone className="mx-auto mb-4 text-green-600" size={32} />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
              اتصل بنا
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              للاستشارات العاجلة والدعم المباشر
            </p>
          </div>

          {/* بطاقة 2 */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition text-center">
            <MessageCircle className="mx-auto mb-4 text-green-600" size={32} />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
              رسالة نصية
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              للاستفسارات التفصيلية والدعم الفني
            </p>
          </div>

          {/* بطاقة 3 */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition text-center">
            <Mail className="mx-auto mb-4 text-green-600" size={32} />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
              رسالة إلكترونية
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              WhatsApp55@gmail.com
            </p>
          </div>
        </div>

        {/* زر واتساب */}
        <div className="flex justify-center">
          <Button
            variant="success"
            icon={<MessageSquare size={20} />}
            iconPosition="left"
            className="bg-green-600 text-white hover:bg-green-700 transition-colors px-6 py-3 rounded-full"
          >
            تواصل عبر WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
