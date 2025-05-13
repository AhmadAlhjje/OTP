'use client';

import { useState } from 'react';
import Button from '@/components/atoms/Button';
import { Moon, Sun, Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');

  return (
    <nav className="w-full h-20 bg-[#009688] text-white flex items-center justify-between px-6 shadow-md">
      {/* اسم التطبيق + زر القائمة */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onToggleSidebar} className="md:hidden">
          <Menu color="white" size={20} />
        </Button>
        <h1 className="text-xl font-bold cursor-pointer">WHATS BOT</h1>
      </div>

      {/* أزرار اللغة والوضع */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={toggleLanguage}>
          {language === 'ar' ? 'English' : 'العربية'}
        </Button>

        <Button variant="ghost" onClick={toggleDarkMode}>
          {darkMode ? <Sun color="black" /> : <Moon color="white" />}
        </Button>
      </div>
    </nav>
  );
}