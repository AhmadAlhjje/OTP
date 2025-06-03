// AccountSwitcher.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  getWhatsappAccounts,
  setActiveAccount,
  getActiveAccount,
} from "@/services/my_accounts";
import useLanguage from "@/hooks/useLanguage";
import { PhoneCall, ChevronDown, Check, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTranslation from "@/hooks/useTranslation";

// --- ✅ تعريف الـ interface ---
interface Account {
  id: string;
  name: string;
  phone: string;
}

interface AccountSwitcherProps {
  accountName?: string; // ← تم إضافتها هنا
}

// --- ✅ تحديث المكون ليستخدم الـ props ---
const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ accountName }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [active, setActive] = useState<Account | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isRTL = language === "ar";

  useEffect(() => {
    const fetchData = async () => {
      const allAccounts = await getWhatsappAccounts();
      const activeAccountData = await getActiveAccount();
      console.log(allAccounts)

      setAccounts(allAccounts);

      if (activeAccountData?.id) {
        const fullAccount = allAccounts.find(
          (acc: any) => acc.id === activeAccountData.id
        );
        setActive(fullAccount || null);
      } else {
        setActive(null);
      }
    };

    fetchData();
  }, []);

  const handleAccountSelect = async (selectedId: string) => {
    const selected = accounts.find((a: any) => a.id === selectedId);
    if (selected) {
      setActive(selected);
      await setActiveAccount(selectedId);
    }
    setIsOpen(false);
  };

  // تأثيرات الحركة للقائمة المنسدلة
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 }
  };

  return (
    <div className={`relative ${isRTL ? "left-4" : "right-4"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* زر القائمة الرئيسي */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-3 flex items-center justify-between gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <PhoneCall size={20} className="text-green-600 dark:text-green-400" />
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("Current_account")}</p>
              <div className="font-medium">
                {/* ✅ أولوية لاسم الحساب النشط، ثم للـ accountName من props */}
                {active ? (
                  <span className="flex items-center gap-1">
                    {active.name}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({active.phone})
                    </span>
                  </span>
                ) : accountName ? (
                  <span className="flex items-center gap-1">
                    {accountName}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">{t("no_account_selected")}</span>
                )}
              </div>
            </div>
          </div>
          
          <ChevronDown 
            size={18} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        </button>
        
        {/* القائمة المنسدلة */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              <div className="p-2 max-h-60 overflow-y-auto">
                {accounts.length === 0 ? (
                  <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                    {t("no_accounts")}
                  </div>
                ) : (
                  accounts.map((acc) => (
                    <motion.button
                      key={acc.id}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      onClick={() => handleAccountSelect(acc.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${
                        active?.id === acc.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          active?.id === acc.id 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                          <Smartphone size={16} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{acc.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{acc.phone}</p>
                        </div>
                      </div>
                      
                      {active?.id === acc.id && (
                        <Check size={16} className="text-green-600 dark:text-green-400" />
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AccountSwitcher;