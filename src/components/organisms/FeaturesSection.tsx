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

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Send className="w-6 h-6" />,
      title: "واجهة برمجية سهلة الاستخدام والتكامل",
      description:
        "API قوي ومرن يمكن دمجه بسهولة مع أنظمتك الحالية",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "حماية كاملة لبياناتك وخصوصية عملائك",
      description:
        "تشفير متقدم وحماية شاملة لجميع البيانات المرسلة",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "إرسال آلاف الرسائل في ثوانٍ معدودة",
      description:
        "سرعة فائقة في الإرسال مع ضمان الوصول",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: "إعلانات بدون حظر",
      description:
        "إرسال إعلانات دون التعرض للحظر من واتساب",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "رد تلقائي ذكي",
      description:
        "نظام ذكي للردود التلقائية مع تخصيص كامل",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "إرسال جماعي متقدم",
      description:
        "إرسال لآلاف المستقبلين مع إدارة ذكية للقوائم",
      color: "from-red-500 to-rose-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            مميزات استثنائية
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            اكتشف مجموعة شاملة من المميزات المتقدمة التي تجعل إرسال رسائل واتساب أسهل وأكثر فعالية
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                تعرف على المزيد
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;