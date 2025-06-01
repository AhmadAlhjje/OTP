"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/organisms/Navbar";
import Sidebar from "../../components/organisms/Sidebar";
import useLanguage from "@/hooks/useLanguage";
import { MantineProvider } from "@mantine/core";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // تحديد إذا كانت الشاشة كبيرة
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col h-screen">
      {/* Navbar - سيظهر في الأعلى دائماً */}
      <Navbar
        isSidebarOpen={sidebarOpen || isLargeScreen}
        toggleSidebar={toggleSidebar}
      />

      <MantineProvider>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar للشاشات الكبيرة - ثابت */}
          {isLargeScreen && (
            <div className="w-80">
              <Sidebar 
                isOpen={true} 
                onClose={closeSidebar} 
                onToggle={toggleSidebar}
                isLargeScreen={true}
              />
            </div>
          )}

          {/* Main Content */}
          <main 
            className="flex-1 p-4 overflow-auto 
            bg-white dark:bg-gray-900 
            text-gray-900 dark:text-gray-100 
            relative z-10"
          >
            {children}
          </main>
        </div>
      </MantineProvider>

      {/* Mobile Sidebar - يظهر فوق المحتوى مع مراعاة ارتفاع النافبار */}
      {sidebarOpen && !isLargeScreen && (
        <>
          {/* خلفية شفافة للنقر عليها لإغلاق السايدبار */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            style={{ top: '80px' }}
            onClick={closeSidebar}
          />
          
          {/* السايدبار المتحرك */}
          <div className="fixed z-50" style={{ top: '80px' }}>
            <Sidebar
              isOpen={sidebarOpen}
              onClose={closeSidebar}
              onToggle={toggleSidebar}
              isLargeScreen={false}
            />
          </div>
        </>
      )}
    </div>
  );
}