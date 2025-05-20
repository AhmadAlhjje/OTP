"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
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
  Home,
  Settings,
  Shield,
} from "lucide-react";

import useTranslation from "@/hooks/useTranslation";
import useLanguage from "@/hooks/useLanguage";
import Button from "../atoms/Button";

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  subItems?: { label: string; href: string; icon?: React.ReactNode }[];
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
  const pathname = usePathname();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // للتأكد من فتح القائمة الفرعية الخاصة بالصفحة الحالية تلقائياً
  useEffect(() => {
    const currentPath = pathname;
    mainItems.forEach((item, index) => {
      if (item.subItems) {
        const isCurrentPathInSubItems = item.subItems.some(
          (subItem) => subItem.href === currentPath
        );
        if (isCurrentPathInSubItems) {
          setOpenSubMenus((prev) => ({ ...prev, [index]: true }));
        }
      }
    });

  // لازاحة الصفحة عند الفتج والاغلاق
  //  const direction = isRTL ? 'right' : 'left';
  // const side = isRTL ? 'paddingRight' : 'paddingLeft';
  // if (isOpen) {
  //   document.body.style.transition = 'padding 0.3s ease';
  //   document.body.style[side as any] = '256px'; // نفس عرض الـ Sidebar
  // } else {
  //   document.body.style[side as any] = '0px';
  // }
  // return () => {
  //   document.body.style[side as any] = '0px'; // تنظيف عند التفكيك
  // };

  // [pathname ,isOpen, isRTL]  الى [pathname] تعديل هذه
  }, [pathname]);

  const handleLogout = () => {
    // تحريك للزر عند النقر
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
      label: t("dashboard"),
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      label: t("whatsapp_send"),
      icon: <MessageSquareText className="w-5 h-5" />,
      subItems: [
        { 
          label: t("send_messages"), 
          href: "/dashboard/send_whatsapp",
          icon: <MessageCircle size={16} />
        },
        { 
          label: t("from_excel"), 
          href: "/dashboard/send/excel",
          icon: <FileText size={16} />
        },
        { 
          label: t("from_contacts"), 
          href: "/dashboard/send/contacts",
          icon: <Users size={16} />
        },
      ],
    },
    {
      label: t("acount_whatsapp"),
      icon: <MessageCircle className="w-5 h-5" />,
      subItems: [
        { 
          label: t("getAcount_whatsapp"), 
          href: "/dashboard/add_accounts",
          icon: <UserPlus size={16} />
        },
        { 
          label: t("my_accounts"), 
          href: "/dashboard/my_accounts",
          icon: <Shield size={16} />
        },
      ],
    },
    {
      label: t("message_templates"),
      icon: <ClipboardList className="w-5 h-5" />,
      subItems: [
        { 
          label: t("private_message_templates"), 
          href: "/dashboard/templates",
          icon: <FileText size={16} />
        },
      ],
    },
    {
      label: t("contact_templates"),
      icon: <UserPlus className="w-5 h-5" />, 
      subItems: [
        {
          label: t("private_contact_templates"),
          href: "/dashboard/TemplatePeoplePage",
          icon: <Users size={16} />
        },
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
  ];

  // الحركات الانتقالية للسايدبار
  const sidebarVariants = {
    open: { 
      width: "260px", 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      } 
    },
    closed: { 
      width: "0px", 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40,
        delay: 0.2 
      } 
    }
  };

  // الحركات الانتقالية للقوائم الفرعية
  const submenuVariants = {
    open: { 
      height: "auto",
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.1
      } 
    },
    closed: { 
      height: 0,
      opacity: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1 
      } 
    }
  };

  const listItemVariants = {
    open: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 40 }
    },
    closed: { 
      y: 20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // اكتشاف ما إذا كان الرابط نشطًا حاليًا
  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-filter backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className={`
          bg-gradient-to-b from-teal-900 to-teal-950 text-white h-screen 
          fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-40 shadow-lg overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64 px-3 py-4" : "w-0"}
          md:translate-x-0
        `}
      >
        {/* Header Logo Area */}
        <div className="flex justify-center items-center mb-6 mt-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="bg-teal-600 p-3 rounded-lg shadow-md"
          >
            <Home className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Navigation Menu */}
        <div className="overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar pr-1">
          <nav className={`transition-all duration-300 space-y-1`}>
            {mainItems.map((item, index) => (
              <React.Fragment key={index}>
                {!item.subItems ? (
                  // Menu item without subitems
                  <Link href={item.href || "#"}>
                    <motion.div
                      whileHover={{ x: isRTL ? -5 : 5, backgroundColor: "rgba(0, 121, 107, 0.7)" }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer 
                        transition-all duration-200 group
                        ${isActive(item.href || "") 
                          ? "bg-teal-700 shadow-md" 
                          : "hover:bg-teal-800/50"}
                      `}
                    >
                      <div className={`
                        ${isActive(item.href || "") 
                          ? "text-teal-300" 
                          : "text-teal-100 group-hover:text-teal-300"}
                      `}>
                        {item.icon}
                      </div>
                      <span className={`
                        font-medium transition-colors
                        ${isActive(item.href || "")
                          ? "text-white" 
                          : "text-gray-100 group-hover:text-white"}
                      `}>
                        {item.label}
                      </span>
                      
                      {isActive(item.href || "") && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-8 bg-teal-400 rounded-r-md"
                        />
                      )}
                    </motion.div>
                  </Link>
                ) : (
                  // Menu item with subitems
                  <div>
                    <motion.div
                      whileHover={{ x: isRTL ? -5 : 5, backgroundColor: "rgba(0, 121, 107, 0.7)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSubMenu(index)}
                      className={`
                        flex justify-between items-center px-3 py-3 rounded-lg cursor-pointer 
                        transition-all duration-200 group
                        ${openSubMenus[index] ? "bg-teal-800" : "hover:bg-teal-800/50"}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`
                          ${openSubMenus[index] ? "text-teal-300" : "text-teal-100 group-hover:text-teal-300"}
                        `}>
                          {item.icon}
                        </div>
                        <span className={`
                          font-medium
                          ${openSubMenus[index] ? "text-white" : "text-gray-100 group-hover:text-white"}
                        `}>
                          {item.label}
                        </span>
                      </div>
                      <motion.div 
                        animate={{ rotate: openSubMenus[index] ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-900/70 text-teal-300"
                      >
                        <ChevronRight size={16} />
                      </motion.div>
                    </motion.div>

                    <AnimatePresence>
                      {openSubMenus[index] && (
                        <motion.div
                          key={`submenu-${index}`}
                          variants={submenuVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="pl-6 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.subItems?.map((subItem, i) => (
                            <motion.div
                              key={`subitem-${index}-${i}`}
                              variants={listItemVariants}
                            >
                              <Link href={subItem.href}>
                                <motion.div
                                  whileHover={{ x: isRTL ? -3 : 3, backgroundColor: "rgba(0, 121, 107, 0.5)" }}
                                  whileTap={{ scale: 0.97 }}
                                  className={`
                                    flex items-center gap-2 text-sm px-3 py-2.5 rounded-md
                                    cursor-pointer transition-all duration-150 group
                                    ${isActive(subItem.href) 
                                      ? "bg-teal-700/70 shadow-sm" 
                                      : "hover:bg-teal-800/30"}
                                  `}
                                >
                                  {subItem.icon && (
                                    <div className={`
                                      flex-shrink-0
                                      ${isActive(subItem.href) 
                                        ? "text-teal-300" 
                                        : "text-teal-200/70 group-hover:text-teal-300"}
                                    `}>
                                      {subItem.icon}
                                    </div>
                                  )}
                                  <span className={`
                                    ${isActive(subItem.href) 
                                      ? "text-white" 
                                      : "text-gray-200/90 group-hover:text-white"}
                                  `}>
                                    {subItem.label}
                                  </span>
                                  
                                  {isActive(subItem.href) && (
                                    <motion.div 
                                      layoutId={`activeSubIndicator-${index}`}
                                      className="absolute left-0 w-1 h-6 bg-teal-400/70 rounded-r-md"
                                    />
                                  )}
                                </motion.div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* زر تسجيل الخروج */}
        <div className="absolute bottom-4 left-3 right-3">
          <div className="pt-4 border-t border-teal-800/60">
            <Button 
              variant="logout" 
              size="md" 
              fullWidth 
              onClick={handleLogout}
              icon={<LogOut size={18} />}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md"
            >
              {t("logout")}
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}