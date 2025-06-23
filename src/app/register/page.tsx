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

  // --- التحقق من صحة الحقول ---
  const validateForm = (data: {
    name: string;
    email: string;
    password: string;
    acceptPrivacyPolicy: boolean;
  }) => {
    const { name, email, password, acceptPrivacyPolicy } = data;

    if (!name.trim()) {
      showToast(t("enterName"), "error");
      return false;
    }

    if (!email.trim()) {
      showToast(t("enterEmail"), "error");
      return false;
    }

    if (!password) {
      showToast(t("enterPassword"), "error");
      return false;
    }

    if (password.length < 6) {
      showToast(t("passwordMinLength"), "error");
      return false;
    }

    if (!acceptPrivacyPolicy) {
      showToast(t("youMustAcceptPrivacyPolicy"), "error");
      return false;
    }

    return true;
  };

  // --- إرسال البيانات ---
  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    acceptPrivacyPolicy: boolean;
  }) => {
    if (!validateForm(data)) return;

    setIsLoading(true);
    try {
      const res = await register(data.name, data.email, data.password);
      console.log("Register Response:", res);
      showToast(t("registrationSuccess"), "success");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Register Failed:", error);
      showToast(t("registrationFailed"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Enhanced Welcome Section */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800">
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Animated Circles */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          {/* Logo Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {t("WhatsApp_Dashboard")}
                </h1>
                <p className="text-green-200 text-sm">
                  {t("Join_Our_Community")}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              {t("startYourJourneyToday")}
            </h2>
          </div>

          {/* Registration Benefits */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-green-100">{t("Free_30_day_trial")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-green-100">{t("_Customer_Support")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-green-100">
                {t("Advanced_Analytics_Dashboard")}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-green-100">{t("No_Setup_Fees")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{t("WhatsApp_Dashboard")}</h1>
              </div>
            </div>
          </div>

          {/* Register Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {t("createAccount")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("fillInYourDetailsToGetStarted")}
              </p>
            </div>

            {/* Form */}
            <RegisterForm onSubmit={handleRegister} />

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                  {t("alreadyHaveAccount")}
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-gray-900 font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {t("login")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {t("creatingAccount")}...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
