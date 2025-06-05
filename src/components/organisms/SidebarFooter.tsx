// SidebarFooter.tsx - الهوامش السفلية (حساب + حالة + تسجيل خروج)
import React, { useState } from "react";
import Button from "../../components/atoms/Button";
import StatusIndicator from "../molecules/StatusIndicator";
import useTranslation from "@/hooks/useTranslation";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {useToast} from "@/hooks/useToast";
import { Check, ChevronDown, LogOut } from "lucide-react";

interface Account {
  id: string;
  name: string;
}

interface SidebarFooterProps {
  accounts: Account[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  status: "loading" | "connected" | "disconnected";
  setStatus: (status: "loading" | "connected" | "disconnected") => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  accounts,
  selectedAccountId,
  setSelectedAccountId,
  status,
  setStatus,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleChangeAccount = async (accountId: string) => {
    try {
      // هنا يمكنك استدعاء API أو استخدام localStorage فقط كمثال
      setSelectedAccountId(accountId);
      localStorage.setItem("activeAccountId", accountId);
      setStatus("connected");
      showToast(t("account_selected_success"), "success");
      setIsSelectOpen(false);
    } catch (error) {
      showToast(t("failed_to_select_account"), "error");
      setStatus("disconnected");
      setIsSelectOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    router.push("/login");
  };

  const getSelectedAccountName = () => {
    const account = accounts.find((acc) => acc.id === selectedAccountId);
    return account ? account.name : t("choose_account");
  };

  return (
    <div className="p-3 bg-gray-50 dark:bg-[#182229] border-t border-gray-200 dark:border-[#2a3942] mt-auto">
      {/* Custom Select Dropdown */}
      <div className="mb-3 p-3 bg-white dark:bg-[#202c33] rounded-xl border border-gray-100 dark:border-[#2a3942] shadow-sm">
        <div className="relative">
          <button
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className={`
              w-full px-4 py-3 text-sm bg-gradient-to-r from-gray-50 to-gray-100 
              dark:from-gray-800 dark:to-gray-700 
              border-2 border-gray-200 dark:border-gray-600 
              rounded-lg transition-all duration-200 
              hover:border-[#00a884] dark:hover:border-[#00d9ff]
              focus:ring-2 focus:ring-[#00a884]/20 dark:focus:ring-[#00d9ff]/20
              focus:border-[#00a884] dark:focus:border-[#00d9ff]
              ${
                isSelectOpen
                  ? "border-[#00a884] dark:border-[#00d9ff] ring-2 ring-[#00a884]/20 dark:ring-[#00d9ff]/20"
                  : ""
              }
              text-gray-700 dark:text-gray-200
              flex items-center justify-between
              group
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                w-2.5 h-2.5 rounded-full transition-colors
                ${
                  status === "connected"
                    ? "bg-green-500 animate-pulse shadow-green-500/50 shadow-sm"
                    : status === "loading"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }
              `}
              ></div>
              <span className="font-medium truncate">
                {selectedAccountId
                  ? getSelectedAccountName()
                  : t("choose_account")}
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`
                transition-all duration-300 text-gray-500 dark:text-gray-400
                group-hover:text-[#00a884] dark:group-hover:text-[#00d9ff]
                ${
                  isSelectOpen
                    ? "rotate-180 text-[#00a884] dark:text-[#00d9ff]"
                    : ""
                }
              `}
            />
          </button>

          {/* Dropdown Options */}
          {isSelectOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="max-h-48 overflow-y-auto">
                {!selectedAccountId && (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    {t("choose_account")}
                  </div>
                )}
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleChangeAccount(account.id)}
                    className={`
                      w-full px-4 py-3 text-sm text-left
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      transition-colors duration-150
                      flex items-center justify-between
                      ${
                        selectedAccountId === account.id
                          ? "bg-[#00a884]/10 dark:bg-[#00d9ff]/10 text-[#00a884] dark:text-[#00d9ff] font-medium"
                          : "text-gray-700 dark:text-gray-200"
                      }
                    `}
                  >
                    <span className="truncate">{account.name}</span>
                    {selectedAccountId === account.id && (
                      <Check size={16} className="text-[#00a884] dark:text-[#00d9ff]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Display */}
        <StatusIndicator status={status} />
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        fullWidth
        onClick={handleLogout}
        className="
          flex items-center justify-center gap-3 px-3 py-2.5
          bg-white dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30 
          text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300
          border border-red-200 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700
          rounded-lg transition-all duration-200 group
          font-medium text-sm
        "
      >
        <LogOut size={18} className="group-hover:-rotate-12 transition-transform" />
        <span>{t("logout")}</span>
      </Button>
    </div>
  );
};

export default SidebarFooter;