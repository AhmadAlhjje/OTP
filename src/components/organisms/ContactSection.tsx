"use client";

import React from "react";
import Button from "../atoms/Button";
import { Phone, Mail, MessageSquare } from "lucide-react";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            جاهز للبدء؟
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            انضم إلى آلاف العملاء الذين يثقون بخدمتنا لإرسال رسائل واتساب بفعالية
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* البطاقة الأولى */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">اتصل بنا</h3>
              <p className="text-gray-600 dark:text-gray-400">
                للاستفسارات العاجلة والدعم المباشر
              </p>
            </div>

            {/* البطاقة الثانية */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">راسلنا</h3>
              <p className="text-gray-600 dark:text-gray-400">
                للاستفسارات التفصيلية والدعم التقني
              </p>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              variant="success"
              icon={<MessageSquare />}
              iconPosition="left"
              className="hover:bg-green-600 hover:text-white transition-colors dark:hover:bg-green-700 dark:bg-green-600"
            >
              تواصل عبر WhatsApp
            </Button>
            <Button
              variant="outline"
              icon={<Mail />}
              iconPosition="left"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors dark:text-green-400 dark:border-green-500 dark:hover:bg-green-900/30"
            >
              أرسل رسالة إلكترونية
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;