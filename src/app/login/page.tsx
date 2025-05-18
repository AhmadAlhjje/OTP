"use client";

import React, { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import LoginForm from "@/components/molecules/LoginForm";
import { login } from "@/services/auth-service";
import { useToast } from "@/hooks/useToast";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { useRouter } from "next/navigation";
import { saveTokens } from "@/services/apiClient";
import Link from "next/link";

export default function LoginPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { emailOrName: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await login(data.emailOrName, data.password);

      if (res.access_token && res.refresh_token) {
        saveTokens(res.access_token, res.refresh_token);
      }

      showToast(t("loginSuccess"), "success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login Failed:", error);
      showToast(t("loginFailed"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-green-600 text-white py-4 px-6 rounded-t-xl flex items-center space-x-3 shadow-md">
          <div className="text-2xl">💬</div>
          <h1 className="text-xl font-bold">WhatsApp</h1>
        </div>

        <div className="bg-white p-8 rounded-b-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t("login")}
          </h2>

          <LoginForm onSubmit={handleLogin} />

          <p className="mt-4 text-center text-sm text-gray-600">
            {t("noAccountYet")}{" "}
            <Link
              href="/register"
              className="text-green-600 hover:underline font-medium"
            >
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
