"use client";

import React, { useState } from "react";
import  useTranslation  from "@/hooks/useTranslation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

interface RegisterFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t("name")}
        placeholder="John Doe"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        label={t("email")}
        placeholder="example@example.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label={t("phone")}
        placeholder="+962 79 123 4567"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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
