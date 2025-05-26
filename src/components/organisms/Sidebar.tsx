"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import {
  MessageSquareText,
  Users,
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  MessageCircle,
  FileText,
  ClipboardList,
  BookOpen,
  UserPlus,
  Menu,
  X,
  Home,
  Settings,
  Activity,
} from "lucide-react";

import useTranslation from "@/hooks/useTranslation";
import useLanguage from "@/hooks/useLanguage";
import Button from "../atoms/Button";

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

function Sidebar({ isOpen, onClose, onToggle, isLargeScreen = false }: SidebarProps) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<number, boolean>>({});
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = language === "ar";

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

  // تحديد إذا كان القسم يحتوي على مسار نشط
  const hasActiveSubItem = (subItems?: { label: string; href: string }[]) => {
    return subItems?.some((item) => pathname === item.href) || false;
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
        // { label: t("from_excel"), href: "/dashboard/send/excel" },
        // { label: t("from_contacts"), href: "/dashboard/send/contacts" },
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
    // {
    //   label: t("contact_templates"),
    //   icon: <UserPlus className="w-5 h-5" />,
    //   subItems: [
    //     {
    //       label: t("private_contact_templates"),
    //       href: "/dashboard/TemplatePeoplePage",
    //     },
    //   ],
    // },
    {
      label: t("contacts"),
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/TemplatePeoplePage",
    },
    // {
    //   label: t("balance"),
    //   icon: <DollarSign className="w-5 h-5" />,
    //   href: "/dashboard/balance",
    //   badge: "جديد",
    // },
    // {
    //   label: t("help"),
    //   icon: <HelpCircle className="w-5 h-5" />,
    //   href: "/dashboard/help",
    // },
  ];

  return (
    <aside
      className={`
        bg-[#f7f8fa] text-gray-800 shadow-2xl transition-all duration-300 ease-in-out
        ${isLargeScreen 
          ? "w-80 h-full relative" 
          : isOpen 
            ? "w-80 h-[calc(100vh-80px)]" // طرح ارتفاع النافبار (80px)
            : "w-0 h-0"
        }
        ${isLargeScreen ? "" : "fixed"}
        overflow-hidden
        ${isRTL ? (isLargeScreen ? "" : "right-0") : (isLargeScreen ? "" : "left-0")}
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
                  <Link href={item.href} onClick={!isLargeScreen ? onClose : undefined}>
                    <div
                      className={`
                        flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg 
                        cursor-pointer transition-all duration-200 group relative
                        ${
                          isActiveRoute(item.href)
                            ? "bg-[#00a884] text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
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
                              : "text-gray-600"
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
                          ? "bg-gray-100 text-[#00a884]"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        transition-colors
                        ${
                          hasActiveSubItem(item.subItems)
                            ? "text-[#00a884]"
                            : "text-gray-600"
                        }
                      `}
                      >
                        {item.icon}
                      </div>
                      <span className="font-medium text-sm">
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`
                      transition-all duration-300
                      ${openSubMenus[index] ? "rotate-180" : ""}
                      ${
                        hasActiveSubItem(item.subItems)
                          ? "text-[#00a884]"
                          : "text-gray-400"
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
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
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
                                    : "bg-gray-400"
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

        {/* Footer - Fixed at bottom */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 mt-auto">
          <div className="mb-3 p-2.5 bg-white rounded-lg border border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">الحالة</span>
              <span className="flex items-center gap-2 text-[#00a884] font-medium">
                <div className="w-2 h-2 bg-[#00a884] rounded-full animate-pulse"></div>
                متصل
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            fullWidth
            onClick={handleLogout}
            className="
              flex items-center justify-center gap-3 px-3 py-2.5
              bg-white hover:bg-red-50 text-red-600 hover:text-red-700
              border border-red-200 hover:border-red-300
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