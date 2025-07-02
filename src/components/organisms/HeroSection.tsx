"use client";

import React from "react";
import Button from "../atoms/Button";
import { Play, MessageSquare } from "lucide-react";
import Link from "../atoms/Link";
import useTranslation from "@/hooks/useTranslation";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="mt-10 pt-20 pb-16 px-4 bg-light dark:bg-[#263238]">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* النصوص */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-xl lg:text-3xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("hero_sectionsend_messages")}
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  {t("hero_sectioneasy_and_professional")}
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {t("hero_sectiondescription")}
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
                className="dark:from-green-600 dark:to-green-700"
              >
                <Link href="/login">{t("hero_sectionget_started")}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<MessageSquare />}
                iconPosition="left"
                fullWidth={false}
                className="dark:text-green-400 dark:border-green-500 dark:hover:bg-green-900/30"
              >
                {t("hero_sectionwatch_demo")}
              </Button>
            </div>
          </div>

          {/* المحاكاة - WhatsApp Chat */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-4">
                {/* نموذج محادثة */}
                <div className="bg-white dark:bg-[#37474F] rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        WhatsApp
                      </div>
                      <div className="text-sm text-green-500">
                        {t("hero_sectionconnected")}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-8">
                      <p className="text-sm text-gray-800 dark:text-gray-100">
                        {t("hero_sectionmessage_1")}
                      </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-[#455A64] p-3 rounded-lg ml-8">
                      <p className="text-sm text-gray-800 dark:text-gray-100">
                        {t("hero_sectionmessage_2")}
                      </p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-8">
                      <p className="text-sm text-gray-800 dark:text-gray-100">
                        {t("hero_sectionmessage_3")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* مؤشر تحميل */}
                <div className="flex items-center justify-center mt-4">
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
