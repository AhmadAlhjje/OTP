"use client";

import React from "react";
import Button from "../atoms/Button";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
        isActive
          ? `border-green-500 bg-green-50 dark:bg-green-900/20`
          : "border-gray-200 dark:border-gray-700"
      } hover:border-green-300 hover:shadow-md`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white flex-shrink-0`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
