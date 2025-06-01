// atoms/DatePicker.tsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholderText?: string;
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  dateFormat?: string;
  className?: string;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  minDate,
  placeholderText,
  showTimeSelect = true,
  timeFormat = "HH:mm",
  timeIntervals = 15,
  dateFormat = "yyyy/MM/dd HH:mm",
  className = ""
}) => (
  <DatePicker
    selected={selected}
    onChange={onChange}
    showTimeSelect={showTimeSelect}
    timeFormat={timeFormat}
    timeIntervals={timeIntervals}
    dateFormat={dateFormat}
    minDate={minDate}
    placeholderText={placeholderText}
    popperClassName="z-50"
    className={`w-full p-4 border-2 border-orange-200 dark:border-orange-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-center font-medium ${className}`}
  />
);

export default CustomDatePicker;