"use client";

import React from "react";
import Card from "../../components/molecules/Card";
import Button from "../../components/atoms/Button";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card
          title="بطاقات الدعم"
          count={0}
          color="red-500"
          icon={<span>🎫</span>}
          actionText="ارسل بطاقة الدعم"
          onActionClick={() => alert("إرسال بطاقة الدعم")}
        />
        <Card
          title="دفتر العناوين"
          count={0}
          color="yellow-500"
          icon={<span>📞</span>}
          actionText="إدارة المجموعات"
          onActionClick={() => alert("إدارة المجموعات")}
        />
        <Card
          title="الرصيد"
          count={0}
          color="teal-500"
          icon={<span>💰</span>}
          actionText="اضافة الرصيد"
          onActionClick={() => alert("إضافة رصيد")}
        />
        <Card
          title="حسابات واتساب"
          count={0}
          color="green-500"
          icon={<span>💬</span>}
          actionText="طلب حساب واتساب"
          onActionClick={() => alert("طلب حساب واتساب")}
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Button className="bg-red-500 text-white">+ ارسل بطاقة الدعم</Button>
        <Button className="bg-yellow-500 text-white">+ إدارة المجموعات</Button>
        <Button className="bg-teal-500 text-white">+ اضافة الرصيد</Button>
        <Button className="bg-green-500 text-white">+ طلب حساب واتساب</Button>
      </div>
    </div>
  );
}
