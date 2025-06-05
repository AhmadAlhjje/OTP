// SubMenuItem.tsx - عنصر قائمة فرعية
import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface SubMenuItemProps {
  label: string;
  href: string;
  isActive?: boolean;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({
  label,
  href,
  isActive = false,
}) => {
  const pathname = usePathname();
  const isActiveRoute = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`
          text-sm px-3 py-2 rounded-md cursor-pointer 
          transition-all duration-200 relative
          ${
            isActiveRoute || isActive
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
                isActiveRoute || isActive
                  ? "bg-white"
                  : "bg-gray-400 dark:bg-gray-500"
              }
            `}
          />
          {label}
        </span>
      </div>
    </Link>
  );
};

export default SubMenuItem;