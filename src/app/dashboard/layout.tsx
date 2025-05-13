'use client';

import { useState } from 'react';
import Navbar from '../../components/organisms/Navbar';
import Sidebar from '../../components/organisms/Sidebar';
import useLanguage from '@/hooks/useLanguage';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useLanguage();

  const toggleNavbar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex flex-col h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar onToggleNavbar={toggleNavbar} />
      
      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={toggleNavbar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
