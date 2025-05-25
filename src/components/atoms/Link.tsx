"use client";

import React from "react";
import Link from "next/link";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // ←←← تم إضافة onClick
}

const LinkComponent: React.FC<LinkProps> = ({ href, children, className = "", onClick }) => {
  return (
    <Link 
      href={href} 
      className={className}
      onClick={onClick} // ←←← تم تمرير	onClick للـ Link
    >
      {children}
    </Link>
  );
};

export default LinkComponent;