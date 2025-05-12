"use client";

import React from "react";
import { useProtectedRoute } from "@/utils/authRedirects";
import Button from "@/components/atoms/Button"; // استيراد الزر الذري

export default function DashboardPage() {
  const { user, loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <p className="text-green-700">جاري التحقق من الحساب...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          مرحبًا بك في لوحة التحكم!
        </h1>
        <p className="text-gray-600 mb-6">أنت مسجل دخول باسم:</p>
        <p className="font-medium text-green-600">{user?.email}</p>

        <Button
          fullWidth
          onClick={() => {
            document.cookie = "access_token=; Max-Age=0; path=/";
            window.location.href = "/login";
          }}
        >
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}
