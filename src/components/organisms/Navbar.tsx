"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronRight,
  ChevronLeft,
  Globe,
  Settings
} from "lucide-react";
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
  const isRTL = language === "ar";

  // تحديد أيقونة القائمة بناءً على حالة السايدبار
  const SidebarIcon = isSidebarOpen ? X : Menu;
  // تحديد أيقونة الاتجاه بناءً على اللغة
  const DirectionIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-16 md:h-20 bg-gradient-to-r from-teal-700 to-teal-600 dark:from-teal-800 dark:to-teal-700 text-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-lg z-50 relative"
    >
      {/* اسم التطبيق + زر القائمة */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button 
          variant="icon"
          onClick={toggleSidebar}
          icon={<SidebarIcon size={22} />}
          className="text-white hover:bg-teal-500/30 p-2"
          aria-label={isSidebarOpen ? t("close_sidebar") : t("open_sidebar")} children={undefined}        />
        
        <AnimatePresence>
          <motion.div 
            key="app-name"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center"
          >
            <motion.h1 
              className="text-lg sm:text-xl font-bold cursor-pointer flex items-center gap-1"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="hidden sm:block">{t("app_name")}</span>
              {!isSidebarOpen && <DirectionIcon size={18} className="ml-1 hidden sm:block" />}
            </motion.h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* أزرار اللغة والوضع */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          onClick={toggleLanguage}
          icon={<Globe size={18} />}
          className="text-white hover:bg-teal-500/30 border-white/30"
          aria-label={t("toggle_language")}
        >
          <span className="text-sm hidden sm:block">
            {language === "ar" ? "English" : "العربية"}
          </span>
        </Button>

        <Button
          variant="icon"
          onClick={toggleTheme}
          icon={theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          className="text-white hover:bg-teal-500/30"
          aria-label={t("toggle_theme")} children={undefined}        />

        <Button
          variant="icon"
          icon={<Settings size={20} />}
          className="text-white hover:bg-teal-500/30 hidden sm:flex"
          aria-label={t("settings")} children={undefined}        />
      </div>

      {/* زر عائم لفتح السايدبار على الشاشات الصغيرة عندما يكون مغلقًا */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 left-6 md:hidden z-50"
          >
            <Button
              variant="primary"
              onClick={toggleSidebar}
              icon={<Menu size={20} />}
              className="shadow-lg rounded-full p-3 bg-teal-600 hover:bg-teal-700"
              aria-label={t("open_sidebar")} children={undefined}            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}