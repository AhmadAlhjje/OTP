"use client";

import React from "react";
import Button from "../atoms/Button";
import { Play, MessageSquare } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* النصوص */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-2 rounded-full text-sm">
                <span>الأفضل في إرسال رسائل واتساب</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  أرسل رسائل واتساب
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  بكل سهولة واحترافية
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                منصة متكاملة وموثوقة لإرسال رسائل واتساب برمجياً مع واجهة برمجية
                قوية ومرنة. ابدأ الآن واستمتع بسرعة وأمان لا مثيل لهما.
              </p>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="success"
                size="lg"
                icon={<Play />}
                iconPosition="left"
                fullWidth={false}
              >
                ابدأ الآن مجاناً
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<MessageSquare />}
                iconPosition="left"
                fullWidth={false}
              >
                شاهد العرض التوضيحي
              </Button>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  معدل التسليم
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  رسالة يومياً
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  دعم فني
                </div>
              </div>
            </div>
          </div>

          {/* المحاكاة - WhatsApp Chat */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-4">
                {/* نموذج محادثة */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">WhatsApp</div>
                      <div className="text-sm text-green-500">متصل</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-8">
                      <p className="text-sm">مرحباً! شكراً لاختيارك خدمتنا</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg ml-8">
                      <p className="text-sm">رائع! كيف يمكنني البدء؟</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-8">
                      <p className="text-sm">سنرسل لك رمز التفعيل خلال ثوانٍ</p>
                    </div>
                  </div>
                </div>

                {/* مؤشر تحميل */}
                <div className="flex items-center justify-center">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
