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
  const [showSubMenu, setShowSubMenu] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    router.push("/login");
  };
  console.log(isOpen);

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
    {
      label: t("logout"),
      icon: <LogOut className="w-5 h-5" />,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {/* {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )} */}

      <aside
        className={`
          bg-[#004d40] text-white  h-screen 
          fixed top-0 left-0 z-40 shadow-md transition-transform duration-300
          ${isOpen ? "translate-x-0 w-64 p-4 " : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <nav
          className={` transition-all duration-300 ${
            !isOpen ? "w-0 overflow-hidden" : "w-full"
          }`}
        >
          {mainItems.map((item, index) => (
            <React.Fragment key={index}>
              {!item.subItems ? (
                item.href ? (
                  <Link href={item.href}>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#00695c] cursor-pointer">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <div
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#c62828] cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                )
              ) : (
                <div>
                  <div
                    onClick={() => setShowSubMenu(!showSubMenu)}
                    className="flex justify-between items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#00695c] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {showSubMenu ? <ChevronDown /> : <ChevronRight />}
                  </div>
                  {showSubMenu && item.subItems && (
                    <div className="pl-10 mt-1 space-y-1">
                      {item.subItems.map((subItem, i) => (
                        <Link href={subItem.href} key={i}>
                          <div className="text-sm px-3 py-1 rounded-lg hover:bg-[#00796b] cursor-pointer">
                            {subItem.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>
      </aside>
    </>
  );
}
