"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger" | "icon";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: ButtonVariant;
}

export default function Button({
  children,
  onClick,
  disabled,
  fullWidth = false,
  type = "button",
  variant = "primary", // افتراضياً primary
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "ghost":
        return "bg-transparent text-green-500 hover:bg-green-500 hover:text-white border border-green-500";
      case "success":
        return "bg-green-600 hover:bg-green-700";
        case 'icon':
      return 'bg-transparent p-2 rounded-full hover:bg-gray-100 text-white';
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "secondary":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-green-600 hover:bg-green-700";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantStyles()} px-6 py-2 rounded-lg font-medium text-white transition-colors ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
