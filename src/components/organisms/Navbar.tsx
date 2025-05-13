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
    <nav className="w-full h-20 bg-[#009688] text-white flex items-center justify-between px-6 shadow-md">
      {/* اسم التطبيق + زر القائمة */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={toggleSidebar} className="md:hidden">
          <Menu color="white" size={20} />
        </Button>
        <h1 className="text-xl font-bold cursor-pointer ml-5 mr-9">
          {t("app_name")}
        </h1>
      </div>

      {/* أزرار اللغة والوضع */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={toggleLanguage}>
          {t("language")}
        </Button>

        <Button variant="ghost" onClick={toggleTheme}>
          {theme === "dark" ? <Sun color="black" /> : <Moon color="white" />}
        </Button>
      </div>
    </nav>
  );
}
