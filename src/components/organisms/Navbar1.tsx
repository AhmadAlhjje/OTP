"use client";

import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import Link from "../atoms/Link";
import { MessageSquare, X, Menu } from "lucide-react";
import NavLink from "../atoms/NavLink";
import useTranslation from "@/hooks/useTranslation";
import { Globe, Moon, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import useLanguage from "@/hooks/useLanguage";

const Navbar = ({
  scrollToSection,
}: {
  scrollToSection: (id: string) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  // إغلاق القائمة عند تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // تتبع التمرير لتغيير مظهر الشريط
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // التنقل السلس مع تعويض ارتفاع الشريط
  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  // منع التمرير في الخلفية عند فتح القائمة
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* شريط التنقل العلوي */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 dark:bg-gray-900/95 dark:border-gray-700"
            : "bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 dark:border-gray-700"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* الشعار */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <Link
                href="#"
                className="text-lg md:text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
              >
                WhatsApp
              </Link>
            </div>

            {/* روابط التنقل - ديسيتك */}
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse dark:text-white">
              <NavLink onClick={() => handleNavClick("features")}>
                {t("navbarfeatures")}
              </NavLink>
              <NavLink onClick={() => handleNavClick("pricing")}>
                {t("navbarpricing")}
              </NavLink>
              <NavLink onClick={() => handleNavClick("faq")}>
                {t("navbarfaq")}
              </NavLink>
              <NavLink onClick={() => handleNavClick("contact")}>
                {t("navbarcontact_us")}
              </NavLink>
            </div>

            {/* أزرار العمل - ديسيتك */}
            <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
              {/* زر تبديل اللغة */}
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                icon={<Globe size={18} />}
                className="text-gray-700 hover:text-green-600 dark:text-white dark:hover:text-green-400"
                aria-label="تبديل اللغة"
              >
                <span className="text-sm hidden sm:block">
                  {language === "ar" ? "EN" : "AR"}
                </span>
              </Button>

              {/* زر تبديل المظهر (داكن/مضيء) */}
              <Button
                variant="icon"
                onClick={toggleTheme}
                icon={theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                className="text-gray-700 hover:text-green-600 dark:text-white dark:hover:text-green-400"
                aria-label="تبديل المظهر"
                children={undefined}
              />
              <Link
                href="/login"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 dark:text-white dark:hover:text-green-600"
              >
                {t("navbarlogin")}
              </Link>
              <Button
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Link href="/login">{t("navbarget_started")}</Link>
              </Button>
            </div>

            {/* زر القائمة - جوال */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ${
                    isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-180"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* خلفية ضبابية عند فتح القائمة */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* القائمة الجانبية - جوال */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl dark:bg-gray-900 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* رأس القائمة */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 dark:text-white">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">WhatsApp</span>
          </div>
          {/* <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button> */}
        </div>

        {/* روابط التنقل */}
        <div className="py-6">
          <div className="space-y-1 px-6">
            {[
              { label: t("navbarfeatures"), id: "features" },
              { label: t("navbarpricing"), id: "pricing" },
              { label: t("navbarfaq"), id: "faq" },
              { label: t("navbarcontact_us"), id: "contact" },
            ].map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-right py-3 px-4 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg ..."
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* فاصل بين الروابط وأزرار الإعدادات */}
          <div className="my-6 mx-6 border-t border-gray-200"></div>

          {/* أزرار الإعدادات - وضع العرض واللغة */}
          <div className="px-6 space-y-4">
            {/* زر تبديل المظهر */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full py-3 px-4 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ..."
            >
              <span>{t("navbartheme")}</span>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* زر تبديل اللغة */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-between w-full py-3 px-4 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ..."
            >
              <span>{t("navbarlanguage")}</span>
              <Globe size={20} />
              {/* <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {language === "ar" ? "EN" : "AR"}
              </span> */}
            </button>
          </div>

          {/* فاصل */}
          <div className="my-6 mx-6 border-t border-gray-200"></div>

          {/* أزرار العمل */}
          <div className="px-6 space-y-3">
            <Link
              href="/login"
              className="block w-full py-3 px-4 text-center text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbarlogin")}
            </Link>
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbarget_started")}
            </Button>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">{t("navbarneed_help")}</p>
            <Link
              href="/support"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbarcontact_support")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
