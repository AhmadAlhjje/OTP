"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useOnAccountUpdate } from "@/hooks/useAccountUpdate";
import Cookies from "js-cookie";
import {
  MessageSquareText,
  Users,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  MessageCircle,
  ClipboardList,
  Bot,
  Check,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import useLanguage from "@/hooks/useLanguage";
import Button from "../atoms/Button";
import {
  getActiveAccount,
  getWhatsappAccounts,
  setActiveAccount,
} from "@/services/my_accounts";
import { useToast } from "@/hooks/useToast";

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  subItems?: { label: string; href: string }[];
  badge?: string | number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  isLargeScreen?: boolean;
}

function Sidebar({
  isOpen,
  onClose,
  onToggle,
  isLargeScreen = false,
}: SidebarProps) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<number, boolean>>({});
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = language === "ar";

  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const loadAccounts = async () => {
    try {
      const allAccounts = await getWhatsappAccounts();
      const activeAccount = await getActiveAccount();
      console.log("activeAccount" ,activeAccount)
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
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [status, setStatus] = useState<
    "loading" | "connected" | "disconnected"
  >("loading");
  useOnAccountUpdate(loadAccounts);
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const allAccounts = await getWhatsappAccounts();
        const activeAccount = await getActiveAccount();

        console.log("getActiveAccount",activeAccount?.id)

        if (Array.isArray(allAccounts)) {
          setAccounts(allAccounts);

          // تحديد الحساب النشط
          const activeId =
            activeAccount?.id ||
            localStorage.getItem("activeAccountId") ||
            null;
          if (activeId) {
            setSelectedAccountId(activeId);
            setStatus("connected");
          } else {
            setStatus("disconnected");
          }
        }
      } catch (error) {
        setStatus("disconnected");
      }
    };

    loadAccounts();
  }, [selectedAccountId]);

  const handleChangeAccount = async (accountId: string) => {
    if (!accountId) {
      setSelectedAccountId(null);
      setStatus("disconnected");
      localStorage.removeItem("activeAccountId");
      setIsSelectOpen(false);
      return;
    }

    try {
      const success = await setActiveAccount(accountId);
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

  const toggleSubMenu = (index: number) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  const hasActiveSubItem = (subItems?: { label: string; href: string }[]) => {
    return subItems?.some((item) => pathname === item.href) || false;
  };

  const getSelectedAccountName = () => {
    const account = accounts.find((acc) => acc.id === selectedAccountId);
    return account ? account.name : t("choose_account");
  };

  const mainItems: SidebarItemProps[] = [
    {
      label: t("dashboard"),
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      label: t("whatsapp_send"),
      icon: <MessageSquareText className="w-5 h-5" />,
      subItems: [
        { label: t("send_messages"), href: "/dashboard/send_whatsapp" },
        {
          label: t("Scheduled_messages"),
          href: "/dashboard/schedule-whatsapp-page",
        },
      ],
    },
    {
      label: t("acount_whatsapp"),
      icon: <MessageCircle className="w-5 h-5" />,
      subItems: [
        { label: t("getAcount_whatsapp"), href: "/dashboard/add_accounts" },
        { label: t("my_accounts"), href: "/dashboard/my_accounts" },
      ],
    },
    {
      label: t("message_templates"),
      icon: <ClipboardList className="w-5 h-5" />,
      subItems: [
        { label: t("private_message_templates"), href: "/dashboard/templates" },
      ],
    },
    {
      label: t("auto_replies"),
      icon: <Bot className="w-5 h-5" />,
      href: "/dashboard/AutoReplyManager",
    },
    {
      label: t("contacts"),
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/TemplatePeoplePage",
    },
  ];

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
      style={{
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 min-h-0">
          {mainItems.map((item, index) => (
            <React.Fragment key={index}>
              {!item.subItems ? (
                item.href ? (
                  <Link
                    href={item.href}
                    onClick={!isLargeScreen ? onClose : undefined}
                  >
                    <div
                      className={`
                        flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg 
                        cursor-pointer transition-all duration-200 group relative
                        ${
                          isActiveRoute(item.href)
                            ? "bg-[#00a884] text-white shadow-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942]"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            transition-colors flex items-center justify-center
                            ${
                              isActiveRoute(item.href)
                                ? "text-white"
                                : "text-gray-600 dark:text-gray-400"
                            }
                          `}
                        >
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="bg-[#ff3838] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ) : null
              ) : (
                <div key={index}>
                  <div
                    onClick={() => toggleSubMenu(index)}
                    className={`
                      flex justify-between items-center gap-3 px-3 py-2.5 rounded-lg 
                      cursor-pointer transition-all duration-200 group
                      ${
                        hasActiveSubItem(item.subItems) || openSubMenus[index]
                          ? "bg-gray-100 dark:bg-[#182229] text-[#00a884] dark:text-[#00d9ff]"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a3942]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          transition-colors
                          ${
                            hasActiveSubItem(item.subItems)
                              ? "text-[#00a884] dark:text-[#00d9ff]"
                              : "text-gray-600 dark:text-gray-400"
                          }
                        `}
                      >
                        {item.icon}
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <div
                      className={`
                        transition-all duration-300
                        ${openSubMenus[index] ? "rotate-180" : ""}
                        ${
                          hasActiveSubItem(item.subItems)
                            ? "text-[#00a884] dark:text-[#00d9ff]"
                            : "text-gray-400 dark:text-gray-500"
                        }
                      `}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>
                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${
                        openSubMenus[index]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div
                      className={`${isRTL ? "pr-6" : "pl-6"} mt-1 space-y-1`}
                    >
                      {item.subItems?.map((subItem, i) => (
                        <Link
                          href={subItem.href}
                          key={i}
                          onClick={!isLargeScreen ? onClose : undefined}
                        >
                          <div
                            className={`
                              text-sm px-3 py-2 rounded-md cursor-pointer 
                              transition-all duration-200 relative
                              ${
                                isActiveRoute(subItem.href)
                                  ? "bg-[#00a884] text-white font-medium"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a3942] hover:text-gray-800 dark:hover:text-gray-200"
                              }
                            `}
                          >
                            <span className="flex items-center gap-2">
                              <div
                                className={`
                                  w-1.5 h-1.5 rounded-full transition-colors
                                  ${
                                    isActiveRoute(subItem.href)
                                      ? "bg-white"
                                      : "bg-gray-400 dark:bg-gray-500"
                                  }
                                `}
                              />
                              {subItem.label}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-[#182229] border-t border-gray-200 dark:border-[#2a3942] mt-auto">
          <div className="mb-3 p-3 bg-white dark:bg-[#202c33] rounded-xl border border-gray-100 dark:border-[#2a3942] shadow-sm">
            {/* Custom Select Dropdown */}
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
                          <Check
                            size={16}
                            className="text-[#00a884] dark:text-[#00d9ff] flex-shrink-0"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Display */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {t("status")}
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`
                  w-2 h-2 rounded-full transition-colors
                  ${
                    status === "connected"
                      ? "bg-green-500 animate-pulse shadow-green-500/50 shadow-sm"
                      : status === "loading"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                  }
                `}
                ></div>
                <span
                  className={`
                  text-xs font-semibold tracking-wide
                  ${
                    status === "connected"
                      ? "text-green-600 dark:text-green-400"
                      : status === "loading"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }
                `}
                >
                  {status === "loading" && t("loading")}
                  {status === "connected" && t("Connected")}
                  {status === "disconnected" && t("no_account_selected")}
                </span>
              </div>
            </div>
          </div>

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
            <LogOut
              size={18}
              className="group-hover:-rotate-12 transition-transform"
            />
            <span>{t("logout")}</span>
          </Button>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isSelectOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSelectOpen(false)}
        />
      )}
    </aside>
  );
}

export default Sidebar;
