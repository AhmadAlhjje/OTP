// SidebarItem.tsx - عنصر قائمة فردي بدون SubMenu
import React from "react";
import Link from "next/link";
import Icon, { iconPaths } from "../atoms/Icon";
import {usePathname} from "next/navigation";

interface SidebarItemProps {
  label: string;
  icon: string;
  href: string;
  badge?: string | number;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  href,
  badge,
  isActive = false,
}) => {
  const pathname = usePathname();
  const isActiveRoute = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`
          flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg 
          cursor-pointer transition-all duration-200 group relative
          ${
            isActiveRoute || isActive
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
                isActiveRoute || isActive
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-400"
              }
            `}
          >
            <Icon path={iconPaths[icon]} />
          </div>
          <span className="font-medium text-sm">{label}</span>
        </div>
        {badge && (
          <span className="bg-[#ff3838] text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

export default SidebarItem;