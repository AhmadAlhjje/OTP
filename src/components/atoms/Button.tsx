"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "success"
  | "danger"
  | "icon"
  | "sidebar"
  | "sidebar-item"
  | "sidebar-parent"
  | "sidebar-submenu"
  | "logout"
  | "outline";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  type = "button",
  variant = "primary",
  className = "",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-green-600 hover:bg-green-700 text-white border-transparent";
      case "secondary":
        return "bg-blue-600 hover:bg-blue-700 text-white border-transparent ";
      case "ghost":
        return "bg-transparent text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-500";
      case "outline":
        return "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white border-transparent";
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white border-transparent";
      case "icon":
        return "bg-transparent p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent";
      case "sidebar":
        return "bg-[#004d40] hover:bg-[#00695c] text-white w-full text-right border-transparent";
      case "sidebar-item":
        return "bg-transparent hover:bg-[#00695c] text-white border-transparent";
      case "sidebar-parent":
        return "bg-transparent hover:bg-[#00695c] text-white border-transparent";
      case "sidebar-submenu":
        return "bg-transparent hover:bg-[#00796b] text-white text-sm border-transparent";
      case "logout":
        return "bg-red-600 hover:bg-red-700 text-white border-transparent";
      default:
        return "bg-green-600 hover:bg-green-700 text-white border-transparent";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return variant === "icon"
          ? "p-1" // زر أيقونة صغير - مناسب لزر الحذف
          : "px-3 py-1.5 text-sm";
      case "lg":
        return "px-8 py-3 text-lg";
      case "md":
      default:
        return "px-6 py-2";
    }
  };

  const isDisabledOrLoading = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabledOrLoading}
      whileHover={isDisabledOrLoading ? {} : { scale: 1.02 }}
      whileTap={isDisabledOrLoading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${variant === "icon" ? "rounded-full" : "rounded-lg"}
        ${fullWidth ? "w-full" : ""}
        ${isDisabledOrLoading ? "opacity-60 cursor-not-allowed" : ""}
        font-medium border transition-all duration-200
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}

      {!loading && icon && iconPosition === "left" && (
        <span className="flex-shrink-0">{icon}</span>
      )}

      {children && <span>{children}</span>}

      {!loading && icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  );
}
