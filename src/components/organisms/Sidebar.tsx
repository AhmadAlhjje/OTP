"use client";
import React, { useState, useEffect } from "react";
import SidebarMenu from "../organisms/SidebarMenu";
import SidebarFooter from "../organisms/SidebarFooter";
import useLanguage from "@/hooks/useLanguage";
import {useOnAccountUpdate} from "@/hooks/useAccountUpdate";
import { useRouter } from "next/navigation";
import useTranslation from "@/hooks/useTranslation";
import { getWhatsappAccounts, getActiveAccount } from "@/services/my_accounts";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  isLargeScreen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onToggle,
  isLargeScreen = false,
}) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { t } = useTranslation();
  const router = useRouter();

  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [status, setStatus] = useState<
    "loading" | "connected" | "disconnected"
  >("loading");

  const loadAccounts = async () => {
    try {
      const allAccounts = await getWhatsappAccounts();
      const activeAccount = await getActiveAccount();
      if (Array.isArray(allAccounts)) {
        setAccounts(allAccounts);
        const activeId =
          activeAccount?.id || localStorage.getItem("activeAccountId") || null;
        setSelectedAccountId(activeId);
        setStatus(activeId ? "connected" : "disconnected");
      }
    } catch (error) {
      setStatus("disconnected");
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useOnAccountUpdate(loadAccounts);

  return (
    <aside
      className={`
        bg-[#f7f8fa] dark:bg-[#202c33] text-gray-800 dark:text-gray-100 
        shadow-2xl transition-all duration-300 ease-in-out
        ${
          isLargeScreen
            ? "w-80 h-full relative"
            : isOpen
            ? "w-80 h-[calc(100vh-80px)]"
            : "w-0 h-0"
        }
        ${isLargeScreen ? "" : "fixed"}
        overflow-hidden
        ${
          isRTL
            ? isLargeScreen
              ? ""
              : "right-0"
            : isLargeScreen
            ? ""
            : "left-0"
        }
      `}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="flex flex-col h-full">
        <SidebarMenu isLargeScreen={isLargeScreen} onClose={onClose} />
        <SidebarFooter
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
          status={status}
          setStatus={setStatus}
        />
      </div>
    </aside>
  );
};

export default Sidebar;