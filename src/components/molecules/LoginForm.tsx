"use client";

import React, { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link"; // استيراد Link

export default function LoginForm({ onSubmit }: { onSubmit: (data: { emailOrName: string; password: string }) => void }) {
  const { t } = useTranslation();
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ emailOrName, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email/Username Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t("emailOrUsername")}
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <Input
            placeholder={t("enterEmailOrUsername")}
            type="text"
            value={emailOrName}
            onChange={(e) => setEmailOrName(e.target.value)}
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t("password")}
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <Input
            placeholder="••••••••••••"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-green-500 transition-colors"
          >
            {showPassword ? (
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : null}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          className="w-full px-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{t("login")}</span>
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Button>
      </div>

      {/* Privacy Policy Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/privacy-policy"
            className="text-green-600 underline hover:text-green-800 dark:hover:text-green-400"
            target="_blank"
          >
            {t("privacyPolicy")}
          </Link>
        </p>
      </div>
    </form>
  );
}