'use client';

import React from 'react';

interface IconProps {
  path: string;
  color?: string;
  size?: number | string;
}



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