'use client';

import React from 'react';
import Link from 'next/link';

interface DashboardItem {
  label: string;
  path: string;
}

interface DashboardPanelProps {
  items: DashboardItem[];
  onClose: () => void;
}

export const DashboardPanel = ({ items, onClose }: DashboardPanelProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out animate-fadeIn z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="font-semibold">حسابات الواتساب</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            &times;
          </button>
        </div>

        <nav className="mt-4 p-4 space-y-2">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              onClick={onClose}
              className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};