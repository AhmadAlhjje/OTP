// molecules/ToggleSchedule.tsx
// زر تبديل بين الإرسال الفوري والمجدول

import React from "react";
import IconWrapper from "@/components/atoms/IconWrapper";
import { Send, Timer } from "lucide-react";

interface ToggleScheduleProps {
  isScheduled: boolean;
  setIsScheduled: (val: boolean) => void;
}

const ToggleSchedule: React.FC<ToggleScheduleProps> = ({ isScheduled, setIsScheduled }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${isScheduled ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
        {isScheduled ? (
          <IconWrapper icon={Timer} size={20} color="#F59E0B" />
        ) : (
          <IconWrapper icon={Send} size={20} color="#10B981" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {isScheduled ? "الإرسال المجدول" : "الإرسال الفوري"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isScheduled ? "اختر وقت مناسب للإرسال" : "إرسال الرسالة الآن"}
        </p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={isScheduled} onChange={(e) => setIsScheduled(e.target.checked)} className="sr-only" />
      <div className={`relative w-14 h-7 transition-colors duration-300 rounded-full ${isScheduled ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
        <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ease-in-out" style={{ transform: isScheduled ? 'translateX(28px)' : 'translateX(0)' }}>
          {isScheduled ? (
            <IconWrapper icon={Timer} size={12} color="#F59E0B" />
          ) : (
            <IconWrapper icon={Send} size={12} color="#10B981" />
          )}
        </div>
      </div>
    </label>
  </div>
);

export default ToggleSchedule;