// molecules/ScheduleDateTime.tsx
// يُظهر حقل تحديد الوقت والتاريخ للرسالة المجدولة مع تنسيق العرض

import React from "react";
import DatePicker from "@/components/atoms/DatePicker";
import IconWrapper from "@/components/atoms/IconWrapper";
import { Clock, Calendar } from "lucide-react";

interface ScheduleDateTimeProps {
  scheduledTime: Date | null;
  setScheduledTime: (date: Date | null) => void;
  getMinDateTime: () => Date;
  formatScheduledTime: (date: Date) => string;
}

const ScheduleDateTime: React.FC<ScheduleDateTimeProps> = ({
  scheduledTime,
  setScheduledTime,
  getMinDateTime,
  formatScheduledTime,
}) => (
  <div className="relative">
    <div className="flex items-center gap-3 mb-4">
      <IconWrapper icon={Calendar} size={20} color="#F59E0B" />
      <h3 className="font-semibold text-gray-800 dark:text-gray-200">تحديد وقت الإرسال</h3>
    </div>
    <DatePicker
      selected={scheduledTime}
      onChange={setScheduledTime}
      minDate={getMinDateTime()}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="yyyy/MM/dd HH:mm"
      placeholderText="اختر تاريخ ووقت الإرسال"
      className="w-full p-4 border-2 border-orange-200 dark:border-orange-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-center font-medium"
    />
    <IconWrapper icon={Clock} size={20} color="#F59E0B" className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />

    {scheduledTime && (
      <div className="mt-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-orange-200 dark:border-orange-700">
        <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
          <IconWrapper icon={Clock} size={16} color="#F59E0B" />
          <span className="text-sm font-medium">سيتم الإرسال في: {formatScheduledTime(scheduledTime)}</span>
        </div>
      </div>
    )}
  </div>
);

export default ScheduleDateTime;