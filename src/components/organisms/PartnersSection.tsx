"use client";
import React from "react";
import Image from "next/image";

const PartnersSection = () => {
  return (
    <section className="py-10 mt-10 bg-white dark:bg-[#202a30] text-center">
      <p className="text-gray-800 dark:text-white font-medium text-lg mb-6">
        نتعاون مع شركائنا الاستراتيجيين لتعزيز فعالية رسائلك التلقائية عبر واتساب، وتوسيع نطاق تأثيرها ونتائجها.
      </p>
      <div className="flex flex-wrap justify-center items-center gap-6 px-4">
        <Image src="/logos/amazon.webp" alt="Amazon" width={100} height={40} />
        <Image src="/logos/dribbble.jpg" alt="Dribbble" width={100} height={40} />
        <Image src="/logos/Google.webp" alt="Google" width={100} height={40} />
        <Image src="/logos/LinkedIn.jpg" alt="LinkedIn" width={100} height={40} />
        <Image src="/logos/Medium.jpg" alt="Medium" width={100} height={40} />
        <Image src="/logos/Microsoft.png" alt="Microsoft" width={100} height={40} />
      </div>
    </section>
  );
};

export default PartnersSection;
