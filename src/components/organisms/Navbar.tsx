"use client";

import Button from "@/components/atoms/Button";
import { Moon, Sun, Menu } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import useLanguage from "@/hooks/useLanguage";
import useTranslation from "@/hooks/useTranslation";

export default function Navbar({
  isSidebarOpen,
  toggleSidebar,
}: {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <nav className="w-full h-16 md:h-20 bg-[#009688] text-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-md">
      {/* اسم التطبيق + زر القائمة */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" onClick={toggleSidebar} className="md:hidden p-2">
          <Menu color="white" size={24} />
        </Button>
        <h1 className="text-lg sm:text-xl font-bold cursor-pointer hidden sm:block">
          {t("app_name")}
        </h1>
      </div>

      {/* أزرار اللغة والوضع */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 py-1"
          aria-label={t("toggle_language")}
        >
          <span className="text-sm sm:text-base hidden sm:block">{t("language")}</span>
          <span className="block sm:hidden">🌐</span> {/* أيقونة بديلة للغة */}
        </Button>

        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label={t("toggle_theme")}
        >
          {theme === "dark" ? (
            <Sun color="yellow" size={20} />
          ) : (
            <Moon color="white" size={20} />
          )}
        </Button>
      </div>
    </nav>
  );
}