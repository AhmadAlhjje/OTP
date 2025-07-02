"use client";

import React from "react";
import {
  ArrowRight,
  Bot,
  Megaphone,
  Send,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("featuresfull_data_protection"),
      description: t("featuresfull_data_protection_desc"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: t("featureseasy_api_integration"),
      description: t("featureseasy_api_integration_desc"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: t("featuresmarketing_without_block"),
      description: t("featuresmarketing_without_block_desc"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t("featureshigh_speed_delivery"),
      description: t("featureshigh_speed_delivery_desc"),
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: t("featuressmart_auto_replies"),
      description: t("featuressmart_auto_replies_desc"),
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("featuresbulk_messaging"),
      description: t("featuresbulk_messaging_desc"),
      gradient: "from-red-500 to-rose-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-[#202a30]">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t("featuresexceptional_features")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t("featurescomprehensive_features")}
          </p>
        </div>

        {/* البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="flex items-center p-6">
                {/* الأيقونة */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${feature.gradient} mr-4 rtl:ml-4 rtl:mr-0`}
                >
                  {feature.icon}
                </div>

                {/* النصوص */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>

                {/* زر المزيد */}
                <button
                  className="text-sm font-medium text-[#2D71E1] dark:text-[#3BE182] px-5 py-1.5 rounded-md rtl:ml-4 rtl:mr-0
                  bg-[linear-gradient(to_right,rgba(59,225,130,0.15),rgba(45,113,225,0.15))]
                  dark:bg-[linear-gradient(to_right,rgba(59,225,130,0.1),rgba(45,113,225,0.1))]
                  hover:bg-[linear-gradient(to_right,rgba(59,225,130,0.3),rgba(45,113,225,0.3))]
                  transition-all duration-200 border border-transparent"
                >
                  {t("featureslearn_more")}
                </button>
              </div>

              {/* خط سفلي بلون تدرج ثابت */}
              <div className="h-1 w-full bg-[linear-gradient(to_right,#17A051,#2469DC)] absolute bottom-0 left-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
