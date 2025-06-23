"use client";

import React, { useState, useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl text-gray-800">
        {/* عنوان الصفحة */}
        <h1 className="text-3xl font-bold mb-6 text-gray-80">
          {t("privacyPolicytitle")}
        </h1>

        {/* الفقرات */}
        <div className="space-y-4 text-gray-70">
          <p>{t("privacyPolicyintroduction")}</p>
          <p>{t("privacyPolicydataCollection")}</p>
          <p>{t("privacyPolicydataUsage")}</p>
          <p>{t("privacyPolicynoThirdPartySharing")}</p>
          <p>{t("privacyPolicyuserRights")}</p>
          <p>{t("privacyPolicysecurity")}</p>
          <p>{t("privacyPolicyupdates")}</p>
          <p>{t("privacyPolicycontactUs")}</p>
        </div>
      </div>
    </div>
  );
}