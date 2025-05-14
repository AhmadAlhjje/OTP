"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  MessageSquareText,
  Users,
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";

import useTranslation from "@/hooks/useTranslation";
import Button from "../atoms/Button";

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  subItems?: { label: string; href: string }[];
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const [openSubMenus, setOpenSubMenus] = useState<Record<number, boolean>>({});
  const { t } = useTranslation();
  const router = useRouter();

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

  const mainItems: SidebarItemProps[] = [
    {
      label: t("whatsapp_send"),
      icon: <MessageSquareText className="w-5 h-5" />,
      subItems: [
        { label: t("send_messages"), href: "/dashboard/send" },
        { label: t("from_excel"), href: "/dashboard/send/excel" },
        { label: t("from_contacts"), href: "/dashboard/send/contacts" },
      ],
    },
    {
      label: t("acount_whatsapp"),
      icon: <MessageSquareText className="w-5 h-5" />,
      subItems: [{ label: t("getAcount_whatsapp"), href: "/dashboard/accounts" }],
    },
    {
      label: t("contacts"),
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/contacts",
    },
    {
      label: t("balance"),
      icon: <DollarSign className="w-5 h-5" />,
      href: "/dashboard/balance",
    },
    {
      label: t("help"),
      icon: <HelpCircle className="w-5 h-5" />,
      href: "/dashboard/help",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-gradient-to-b from-[#004d40] to-[#00332d] text-white h-screen 
          fixed top-0 left-0 z-40 shadow-lg transition-transform duration-300
          ${
            isOpen
              ? "translate-x-0 w-64 p-4"
              : "w-0 overflow-hidden -translate-x-full"
          }
          md:relative md:translate-x-0
        `}
      >
        <nav className={`transition-all duration-300`}>
          {mainItems.map((item, index) => (
            <React.Fragment key={index}>
              {!item.subItems ? (
                item.href ? (
                  <Link href={item.href}>
                    <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#00695c] cursor-pointer transition-all duration-200 transform hover:translate-x-1">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <div
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-700 cursor-pointer transition-all duration-200 transform hover:translate-x-1"
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                )
              ) : (
                <div>
                  <div
                    onClick={() => toggleSubMenu(index)}
                    className="flex justify-between items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#00695c] cursor-pointer transition-all duration-200 transform hover:translate-x-1"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#004d40] text-white">
                      {openSubMenus[index] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                  </div>

                  <div
                    className="pl-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: openSubMenus[index]
                        ? `${item.subItems.length * 40}px`
                        : "0",
                    }}
                  >
                    {item.subItems?.map((subItem, i) => (
                      <Link href={subItem.href} key={i}>
                        <div className="text-sm px-3 py-2 rounded-md hover:bg-[#00796b] cursor-pointer transition-colors">
                          {subItem.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* زر تسجيل الخروج */}
          <div className="mt-auto pt-6 border-t border-[#00695c]">
            <Button variant="logout" fullWidth onClick={handleLogout}>
              <div className="flex items-center gap-3">
                <LogOut size={20} />
                <span>{t("logout")}</span>
              </div>
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
}
