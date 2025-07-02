"use client";

import React from "react";
import Navbar1 from "../components/organisms/Navbar1";
import FeaturesSection from "../components/organisms/FeaturesSection";
import PricingSection from "../components/organisms/PricingSection";
import FAQSection from "../components/organisms/FAQSection";
import ContactSection from "../components/organisms/ContactSection";
import HeroSection from "../components/organisms/HeroSection";
import Footer from "../components/organisms/Footer";
import PartnersSection from "@/components/organisms/PartnersSection";
import StatsSection from "@/components/organisms/StatsSection";

const HomePageTemplate = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dark:bg-[#202a30] pt-10">
      <Navbar1 scrollToSection={scrollToSection} />
      <HeroSection />
      <PartnersSection/>
      <FeaturesSection />
      <StatsSection/>
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePageTemplate;
