"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

interface LoginFormProps {
  onSubmit: (data: { emailOrName: string; password: string }) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation();
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ emailOrName, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t("email")}
        placeholder="example@example.com"
        type="text"
        value={emailOrName}
        onChange={(e) => setEmailOrName(e.target.value)}
      />

      <Input
        label={t("password")}
        placeholder="••••••••"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        fullWidth
        className="px-6 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
      >
        {t("login")}
      </Button>
    </form>
  );
}
