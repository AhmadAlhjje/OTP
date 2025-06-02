"use client";

import React, { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import RegisterForm from "@/components/molecules/RegisterForm";
import Link from "next/link";
import { register } from "@/services/auth-service";
import { useToast } from "@/hooks/useToast";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // ارسال البيانات إلى الخادم
  const handleRegister = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await register(data.name, data.email, data.phone, data.password);
      console.log("Register Response:", res);
      showToast("تم التسجيل بنجاح!", "success");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Register Failed:", error);
      showToast("فشل في التسجيل", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Header with WhatsApp logo */}
        <div className="bg-green-600 text-white py-4 px-6 rounded-t-xl flex items-center space-x-3 shadow-md">
          <div className="text-2xl">💬</div>
          <h1 className="text-xl font-bold">WhatsApp</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-b-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            {t("register")}
          </h2>

          <RegisterForm onSubmit={handleRegister} />

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium hover:underline"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}
    </div>
  );
}