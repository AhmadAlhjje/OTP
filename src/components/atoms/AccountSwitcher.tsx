"use client";

import React, { useEffect, useState } from "react";
import {
  getWhatsappAccounts,
  setActiveAccount,
  getActiveAccount,
} from "@/services/my_accounts";
import useLanguage from "@/hooks/useLanguage";

const AccountSwitcher = () => {
  // حالة لتخزين قائمة حسابات الواتساب المتوفرة
  const [accounts, setAccounts] = useState<any[]>([]);
  // حالة لتخزين الحساب النشط الحالي
  const [active, setActive] = useState<any>(null);
  // جلب اللغة الحالية (لتحديد اتجاه العناصر مثلاً)
  const { language } = useLanguage();

  // عند تحميل الكومبوننت، جلب الحسابات والحساب النشط
  useEffect(() => {
    const fetchData = async () => {
      const allAccounts = await getWhatsappAccounts();  // جلب كل حسابات الواتساب
      const activeAccountData = await getActiveAccount(); // جلب الحساب النشط (عادة يحتوي فقط على id)

      setAccounts(allAccounts); // تحديث الحالة بالقائمة الكاملة

      if (activeAccountData?.id) {
        // البحث عن تفاصيل الحساب النشط بناءً على id
        const fullAccount = allAccounts.find(
          (acc: any) => acc.id === activeAccountData.id
        );
        setActive(fullAccount || null); // تعيين الحساب النشط أو null إذا لم يُعثر عليه
      } else {
        setActive(null); // إذا لم يكن هناك حساب نشط
      }
    };

    fetchData();
  }, []);

  // دالة تغيير الحساب النشط عند اختيار المستخدم من القائمة
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value; // id الحساب المختار
    const selected = accounts.find((a: any) => a.id === selectedId); // إيجاد بيانات الحساب المختار
    setActive(selected); // تعيينه كحساب نشط محلياً
    await setActiveAccount(selectedId); // تحديث الحساب النشط في الخدمة أو السيرفر
  };

  return (
    <div
      className={`fixed bottom-20 ${
        language === "ar" ? "left-4" : "right-4"
      } bg-white shadow-lg rounded-xl px-9 py-2 border border-gray-200`}
    >
      {/* عنوان عرض الحساب الحالي */}
      <div className="text-sm font-semibold mb-1">الحساب الحالي:</div>

      {/* عرض اسم ورقم الحساب النشط أو رسالة عدم اختيار */}
      {active ? (
        <div className="mb-2">
          {active.name} ({active.phone})
        </div>
      ) : (
        <div className="text-gray-400">لم يتم اختيار حساب</div>
      )}

      {/* قائمة اختيار الحساب لتغيير الحساب النشط */}
      <select
        onChange={handleChange}
        value={active?.id || ""}
        className="border rounded px-2 py-1 w-full"
      >
        <option value="">اختر حسابًا</option>
        {/* عرض جميع الحسابات المتاحة */}
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.name} - {acc.phone}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AccountSwitcher;
