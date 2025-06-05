'use client';

import React from 'react';

interface IconProps {
  path: string;
  color?: string;
  size?: number | string;
}

// IconMap.ts - لتحويل اسم الأيقونة إلى path
export const iconPaths: Record<string, string> = {
  Dashboard: "M3 9h18v10H3z M12 4l8 5H4l8-5z",
  WhatsAppSend: "M21 11.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6",
  Contacts: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
  Templates: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  AutoReplies: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  WhatsAppAccount: "M20.59 13.41A8 8 0 1 1 13.41 6.23a8 8 0 0 1 7.18 7.18z",
  ChevronDown: "m6 9 6 6 6-6",
  Logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
  Check: "M20 6 9 17l-5-5",
};

export default function Icon({ path, color = 'text-gray-600', size = 6 }: IconProps) {
  const sizeClass = typeof size === 'number' ? `${size * 4}px` : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${color}`}
      width={sizeClass}
      height={sizeClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}