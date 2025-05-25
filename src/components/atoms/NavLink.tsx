"use client";

import React from "react";

interface NavLinkProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="hover:text-green-600 transition-colors duration-200 text-right"
    >
      {children}
    </button>
  );
};

export default NavLink;