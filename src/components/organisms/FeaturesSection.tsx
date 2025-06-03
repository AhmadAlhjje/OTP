"use client";

import React, { useState, useEffect } from "react";
import FeatureCard from "../molecules/FeatureCard";
import {
  ArrowRight,
  Bot,
  Megaphone,
  Send,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import Button from "../atoms/Button";
import useTranslation from "@/hooks/useTranslation";

const FeaturesSection = () => {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState(0);

  // --- تبديل المميزات تلقائياً ---
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- قائمة المميزات ---
  const features = [
    {
      icon: <Send className="w-6 h-6" />,
      title: t("featureseasy_api_integration"),
      description: t("featureseasy_api_integration_desc"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("featuresfull_data_protection"),
      description: t("featuresfull_data_protection_desc"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t("featureshigh_speed_delivery"),
      description: t("featureshigh_speed_delivery_desc"),
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: t("featuresmarketing_without_block"),
      description: t("featuresmarketing_without_block_desc"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: t("featuressmart_auto_replies"),
      description: t("featuressmart_auto_replies_desc"),
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("featuresbulk_messaging"),
      description: t("featuresbulk_messaging_desc"),
      color: "from-red-500 to-rose-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t("featuresexceptional_features")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("featurescomprehensive_features")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* القائمة الجانبية للمميزات */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                isActive={activeFeature === index}
                onClick={() => setActiveFeature(index)}
              />
            ))}
          </div>

          {/* عرض التفاصيل للميزة الحالية */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl transition-colors duration-300">
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} text-white mb-6`}
              >
                {features[activeFeature].icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {features[activeFeature].title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                {features[activeFeature].description}
              </p>
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight />}
                className="dark:from-green-600 dark:to-emerald-600"
              >
                {t("featureslearn_more")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;