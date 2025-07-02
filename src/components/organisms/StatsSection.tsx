"use client";
import React from "react";
import { Smile, MessageCircle, CheckSquare } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: <CheckSquare size={28} className="text-white" />,
      value: "99.9%",
      label: "معدل التسليم",
    },
    {
      icon: <MessageCircle size={28} className="text-white" />,
      value: "+1M",
      label: "رسالة يومياً",
    },
    {
      icon: <Smile size={28} className="text-white" />,
      value: "24/7",
      label: "دعم فني",
    },
    
  ];

  return (
    <section className="bg-[#263238] py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-8 text-center text-white">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-lg w-64 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 text-2xl font-bold">
              {stat.icon} {stat.value} 
            </div>
            <div className="mt-2 text-sm text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
