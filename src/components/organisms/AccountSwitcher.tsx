// organisms/AccountSwitcher.tsx
// زر تبديل الحساب مع عرض الحساب الحالي

import React from "react";
import Button from "@/components/atoms/Button";

interface AccountSwitcherProps {
  accountName: string;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ accountName }) => (
  <div className="relative group">
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm font-medium">الحساب:</span>
      <span className="font-bold">{accountName}</span>
    </div>
    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-3 z-50">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">اختر حسابًا آخر</h4>
      <ul>
        <li className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          حساب 1
        </li>
        <li className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          حساب 2
        </li>
        <li className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          حساب 3
        </li>
      </ul>
    </div>
  </div>
);

export default AccountSwitcher;