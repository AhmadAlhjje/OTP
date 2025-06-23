"use client";

import useTranslation from "@/hooks/useTranslation";
import AccountList from "./AccountList";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { useState } from "react";

export default function AccountsPage() {
  const { t } = useTranslation();
  const [pageLoading, setPageLoading] = useState(false);

  return (
    <main className="p-4 relative">
      {pageLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner
            message={t("linked_accounts")}
            size="md"
            color="green"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">{t("linked_accounts")}</h1>
      <AccountList onLoadingChange={setPageLoading} />
    </main>
  );
}