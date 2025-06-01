"use client";

import React from "react";
import Button from "../atoms/Button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "خطة البداية",
      price: "مجاني",
      period: "إلى الأبد",
      features: [
        "استخدام رقم هاتف واحد",
        "100 رسالة شهرياً",
        "دعم فني أساسي",
        "واجهة برمجية محدودة"
      ],
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "الخطة الأساسية",
      price: "180 ل.س",
      period: "شهرياً",
      features: [
        "استخدام أي رقم هاتف",
        "5,000 رسالة شهرياً",
        "جميع أنواع الرسائل",
        "دعم فني متقدم",
        "تقارير مفصلة"
      ],
      popular: false,
      color: "border-green-200"
    },
    {
      name: "الخطة الاحترافية",
      price: "300 ل.س",
      period: "شهرياً",
      features: [
        "أرقام غير محدودة",
        "رسائل غير محدودة",
        "ميزات متقدمة",
        "دعم أولوية 24/7",
        "تكامل مخصص",
        "إدارة فرق"
      ],
      popular: true,
      color: "border-green-500"
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            خطط تناسب جميع الاحتياجات
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اختر الخطة المناسبة لك مع مرونة كاملة للترقية أو التخفيض في أي وقت
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 ${plan.color} transition-all hover:shadow-2xl hover:scale-105 ${
                plan.popular ? 'ring-4 ring-green-500/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    الأكثر شعبية
                  </div>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-green-600">{plan.price}</span>
                  <span className="text-gray-600 mr-2">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "success" : "outline"}
                fullWidth
                loading={false}
              >
                {plan.price === 'مجاني' ? 'ابدأ مجاناً' : 'اشترك الآن'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;