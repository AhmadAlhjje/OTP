"use client";
import useTranslation from "@/hooks/useTranslation";
import AccountList from "./AccountList";

export default function AccountsPage() {

  const { t } = useTranslation();
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t("linked_accounts")}</h1>{" "}
      <AccountList />
    </main>
  );
}
