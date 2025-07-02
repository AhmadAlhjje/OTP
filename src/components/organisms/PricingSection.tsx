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
      popular: true,
      color: "border-green-400",
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
      popular: false,
      color: "border-gray-200 dark:border-gray-700",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#F6F9FB] dark:bg-[#202a30]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
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
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border ${plan.color} transition-all hover:shadow-md hover:scale-[1.02] ${
                plan.popular ? "border-2 shadow-lg" : ""
              }`}
            >
              {/* تفاصيل الخطة */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-green-600">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 mr-1">
                    /{plan.period}
                  </span>
                </div>
              </div>

              {/* الميزات */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* زر الاشتراك */}
              <Button
                variant={plan.popular ? "success" : "outline"}
                fullWidth
                loading={false}
                className={`${
                  plan.popular
                    ? "dark:bg-green-600 dark:hover:bg-green-700 bg-green-600 text-white hover:bg-green-700"
                    : "border border-gray-300 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                } rounded-lg`}
              >
                {plan.price === t("pricingplan_start_price")
                  ? t("pricingget_started_free")
                  : t("pricingsubscribe_now")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
