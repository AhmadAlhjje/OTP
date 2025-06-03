"use client";

import React from "react";
import Button from "../atoms/Button";
import { Check } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

const PricingSection = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: t("pricingplan_start"),
      price: t("pricingplan_start_price"),
      period: t("pricingplan_start_period"),
      features: [
        t("pricingfeature_1_start"),
        t("pricingfeature_2_start"),
        t("pricingfeature_3_start"),
        t("pricingfeature_4_start"),
      ],
      popular: false,
      color: "border-gray-200 dark:border-gray-700",
    },
    {
      name: t("pricingplan_basic"),
      price: t("pricingplan_basic_price"),
      period: t("pricingplan_basic_period"),
      features: [
        t("pricingfeature_1_basic"),
        t("pricingfeature_2_basic"),
        t("pricingfeature_3_basic"),
        t("pricingfeature_4_basic"),
        t("pricingfeature_5_basic"),
      ],
      popular: false,
      color: "border-green-200 dark:border-green-800",
    },
    {
      name: t("pricingplan_pro"),
      price: t("pricingplan_pro_price"),
      period: t("pricingplan_pro_period"),
      features: [
        t("pricingfeature_1_pro"),
        t("pricingfeature_2_pro"),
        t("pricingfeature_3_pro"),
        t("pricingfeature_4_pro"),
        t("pricingfeature_5_pro"),
        t("pricingfeature_6_pro"),
      ],
      popular: true,
      color: "border-green-500 dark:border-green-400",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t("pricingsection_title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("pricingsection_description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border-2 ${plan.color} transition-all hover:shadow-2xl hover:scale-105 ${
                plan.popular ? "ring-4 ring-green-500/20" : ""
              }`}
            >
              {/* الشعار "الأكثر شعبية" */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    {t("pricingmost_popular")}
                  </div>
                </div>
              )}

              {/* تفاصيل الخطة */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-green-600">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400 mr-2">/{plan.period}</span>
                </div>
              </div>

              {/* الميزات */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* زر الاشتراك */}
              <Button
                variant={plan.popular ? "success" : "outline"}
                fullWidth
                loading={false}
                className={`${plan.popular ? "dark:bg-green-600 dark:hover:bg-green-700" : "dark:text-green-400 dark:border-green-500 dark:hover:bg-green-900/20"}`}
              >
                {plan.price === t("pricingplan_start_price") ? t("pricingget_started_free") : t("pricingsubscribe_now")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;