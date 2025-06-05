// SidebarMenu.tsx - القائمة الكاملة للـ Sidebar
import React, { useState } from "react";
import SidebarItem from "../molecules/SidebarItem";
import SubMenuItem from "../molecules/SubMenuItem";
import Icon, { iconPaths } from "../../components/atoms/Icon";
import useTranslation from "@/hooks/useTranslation";
import {usePathname} from "next/navigation";

interface SidebarMenuProps {
  isLargeScreen?: boolean;
  onClose?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isLargeScreen = false,
  onClose,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<Record<number, boolean>>({});

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

  const mainItems = [
    {
      label: t("dashboard"),
      icon: "Dashboard",
      href: "/dashboard",
    },
    {
      label: t("whatsapp_send"),
      icon: "WhatsAppSend",
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
      icon: "WhatsAppAccount",
      subItems: [
        { label: t("getAcount_whatsapp"), href: "/dashboard/add_accounts" },
        { label: t("my_accounts"), href: "/dashboard/my_accounts" },
      ],
    },
    {
      label: t("message_templates"),
      icon: "Templates",
      subItems: [
        { label: t("private_message_templates"), href: "/dashboard/templates" },
      ],
    },
    {
      label: t("auto_replies"),
      icon: "AutoReplies",
      href: "/dashboard/AutoReplyManager",
    },
    {
      label: t("contacts"),
      icon: "Contacts",
      href: "/dashboard/TemplatePeoplePage",
    },
  ];

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 min-h-0">
      {mainItems.map((item, index) => (
        <React.Fragment key={index}>
          {!item.subItems ? (
            item.href ? (
              <SidebarItem
                label={item.label}
                icon={item.icon}
                href={item.href}
                // badge={item.badge}
                isActive={isActiveRoute(item.href)}
              />
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
                    <Icon path={iconPaths[item.icon]} />
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
                  <Icon path={iconPaths["ChevronDown"]} />
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
                <div className="pr-6 mt-1 space-y-1">
                  {item.subItems.map((subItem, i) => (
                    <SubMenuItem
                      key={i}
                      label={subItem.label}
                      href={subItem.href}
                      isActive={isActiveRoute(subItem.href)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default SidebarMenu;