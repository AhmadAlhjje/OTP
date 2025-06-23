"use client";

import React, { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link"; // استيراد Link

interface RegisterFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    acceptPrivacyPolicy: boolean;
  }) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptPrivacyPolicy) {
      alert(t("youMustAcceptPrivacyPolicy")); // يمكنك استبدالها بـ Toast
      return;
    }

    onSubmit({ name, email, password, acceptPrivacyPolicy });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t("name")}
        </label>
        <div className="relative group">
          <Input
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t("email")}
        </label>
        <div className="relative group">
          <Input
            placeholder="example@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t("password")}
        </label>
        <div className="relative group">
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
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : null}
          </button>
        </div>
      </div>

      {/* Checkbox for Privacy Policy */}
      <div className="flex items-start">
        <input
          id="privacy-policy"
          type="checkbox"
          checked={acceptPrivacyPolicy}
          onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
          className="mt-1 h-4 w-4 text-green-600 rounded"
        />
        <label
          htmlFor="privacy-policy"
          className="ml-4 mr-3 text-sm text-gray-600 dark:text-gray-400"
        >
          {t("iAgreeTo")}{" "}
          <Link
            href="/privacy-policy"
            className="text-green-600 underline"
            target="_blank"
          >
            {t("privacyPolicy")}
          </Link>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          disabled={!acceptPrivacyPolicy}
          className={`
            w-full px-6 py-4 rounded-xl font-bold text-white 
            bg-gradient-to-r from-green-600 to-green-700 
            hover:from-green-700 hover:to-green-800 
            focus:outline-none focus:ring-4 focus:ring-green-500/30 
            focus:ring-offset-2 dark:focus:ring-offset-gray-800 
            transition-all duration-200 transform hover:scale-[1.02] 
            active:scale-[0.98] shadow-lg hover:shadow-xl
            ${!acceptPrivacyPolicy ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{t("register")}</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </span>
        </Button>
      </div>
    </form>
  );
}