"use client";

import React from "react";
import Navbar1 from "../components/organisms/Navbar1";
import FeaturesSection from "../components/organisms/FeaturesSection";
import PricingSection from "../components/organisms/PricingSection";
import FAQSection from "../components/organisms/FAQSection";
import ContactSection from "../components/organisms/ContactSection";
import HeroSection from "../components/organisms/HeroSection";
import Footer from "../components/organisms/Footer";

const HomePageTemplate = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Navbar1 scrollToSection={scrollToSection} />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePageTemplate;
