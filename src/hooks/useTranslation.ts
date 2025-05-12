"use client";

import { useEffect, useState } from "react";

// نوع بيانات الترجمة
type Translation = {
  [key: string]: {
    [key: string]: string;
  };
};

// تحميل ملفات الترجمة
const loadTranslations = async (lang: string): Promise<Translation> => {
  const response = await fetch(`/locales/${lang}.json`);
  return await response.json();
};

// الـ hook الأساسي
export const useTranslation = () => {
  const [lang, setLang] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") || "en";
    }
    return "en";
  });
  const [translations, setTranslations] = useState<Translation>({});
  const [isRtl, setIsRtl] = useState(false);

  // تحميل الترجمة عند تغيير اللغة
  useEffect(() => {
    const loadLang = async () => {
      const data = await loadTranslations(lang);
      localStorage.setItem('lang', lang);
      setTranslations(data);
      setIsRtl(lang === "ar");
    };

    loadLang();
  }, [lang]);

  // دالة للحصول على الكلمة المترجمة
  const t = (key: string): string => {
    const [section, label] = key.split(".");
    if (
      section &&
      label &&
      translations[section] &&
      translations[section][label]
    ) {
      return translations[section][label];
    }
    return key; // إذا لم توجد الترجمة، نعيد المفتاح
  };

  return {
    t,
    lang,
    setLang,
    isRtl,
  };
};
