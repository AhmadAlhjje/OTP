"use client";

import React from "react";
import { MessageSquare, Mail, Phone } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#263238] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* معلومات الشركة */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">WhatsApp</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              {t("footercompany_description")}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t("footerquick_links")}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footerfeatures")}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footerpricing")}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footerfaq")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footerdocumentation")}
                </a>
              </li>
            </ul>
          </div>

          {/* الدعم */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t("footersupport")}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footerhelp_center")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footercontact_us")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footerreport_issue")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footerservice_status")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* خط الفصل السفلي */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 WhatsApp. {t("footerrights_reserved")}
            </div>
            <div className="flex space-x-6 rtl:space-x-reverse text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                {t("footerprivacy_policy")}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t("footerterms_of_use")}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t("footercookies")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;