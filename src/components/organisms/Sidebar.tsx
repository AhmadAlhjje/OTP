"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import {
  MessageSquareText,
  Users,
  ChevronDown,
  LogOut,
  MessageCircle,
  ClipboardList,
  Bot,
} from "lucide-react";

import useTranslation from "@/hooks/useTranslation";
import useLanguage from "@/hooks/useLanguage";
import Button from "../atoms/Button";
import { SidebarItemProps, SidebarProps } from "@/types/sidbar";
import AccountSwitcher from "../atoms/AccountSwitcher";
import { getWhatsappAccounts, getActiveAccount, setActiveAccount } from "@/services/my_accounts";

function Sidebar({
  isOpen,
  onClose,
  onToggle,
  isLargeScreen = false,
}: SidebarProps) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<number, boolean>>({});
  const [accounts, setAccounts] = useState<any[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = language === "ar";

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accountsList = await getWhatsappAccounts();
        setAccounts(accountsList);

        // إذا كان هناك حساب نشط، اضبطه
        const storedAccountId = Cookies.get("active_account_id"); // أو استخدم مكان آخر للتخزين
        if (storedAccountId) {
          setActiveAccountId(storedAccountId);
        } else if (accountsList.length > 0) {
          setActiveAccountId(accountsList[0].id); // أول حساب كافتراضي
        }
      } catch (error) {
        console.error("فشل في جلب الحسابات");
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

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

  // تحديد إذا كان المسار نشط
  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  const handleAccountChange = async (accountId: string) => {
    try {
      await setActiveAccount(accountId); // ← استدعاء الـ API لتغيير الحساب
      setActiveAccountId(accountId);
      Cookies.set("active_account_id", accountId); // حفظ ID الحساب النشط

      // إعادة تحميل الصفحة أو تحديث البيانات
      window.location.reload(); // ← يمكنك استبدال هذا بالمنطق المناسب
    } catch (error) {
      console.error("فشل في تبديل الحساب:", error);
    }
  };

  // تحديد إذا كان القسم يحتوي على مسار نشط
  const hasActiveSubItem = (subItems?: { label: string; href: string }[]) => {
    return subItems?.some((item) => pathname === item.href) || false;
  };

  const mainItems: SidebarItemProps[] = [
    // {
    //   label: t("dashboard"),
    //   icon: <LayoutDashboard className="w-5 h-5" />,
    //   href: "/dashboard",
    // },
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
      href: "/dashboard/templates",
      // subItems: [
      //   { label: t("private_message_templates"), href: "/dashboard/templates" },
      // ],
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
            ? "w-80 h-[calc(100vh-80px)]" // طرح ارتفاع النافبار (80px)
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
        {/* Navigation - With flexible height */}
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
                <div>
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

        {/* Account Switcher */}
        <div className="mr-2 mb-3 p-2.5 bg-white dark:bg-[#202c33] rounded-lg border border-gray-100 dark:border-[#2a3942]">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {t("active_account")}
          </div>
          {loading ? (
            <div className="text-xs text-gray-500">{t("loading")}</div>
          ) : (
            <AccountSwitcher
              accountName={
                accounts.find((acc) => acc.id === activeAccountId)?.name ||
                t("no_account_selected")
              }
              onAccountChange={handleAccountChange}
            />
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="p-3 bg-gray-50 dark:bg-[#182229] border-t border-gray-200 dark:border-[#2a3942] mt-auto">
          {/* <div className="mb-3 p-2.5 bg-white dark:bg-[#202c33] rounded-lg border border-gray-100 dark:border-[#2a3942]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {t("status")}
              </span>
              <span className="flex items-center gap-2 text-[#00a884] dark:text-[#00d9ff] font-medium">
                <div className="w-2 h-2 bg-[#00a884] dark:bg-[#00d9ff] rounded-full animate-pulse"></div>
                {t("Connected")}
              </span>
            </div>
          </div> */}

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
    </aside>
  );
}

export default Sidebar;
