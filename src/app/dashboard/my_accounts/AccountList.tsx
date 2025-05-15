"use client";

import { useEffect, useState } from "react";
import AccountCard from "@/components/molecules/AccountCard";
import useTranslation from "@/hooks/useTranslation";
import {
  getWhatsappAccounts,
  deleteWhatsappAccount,
} from "@/services/my_accounts";

const AccountList = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<
    { id: string; name: string; phone: string }[]
  >([]);

  useEffect(() => {
    getWhatsappAccounts().then(setAccounts);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteWhatsappAccount(id);
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  return (
    <div className="space-y-4">
      {accounts.length === 0 ? (
        <p className="text-center text-muted-foreground">{t("no_accounts")}</p>
      ) : (
        accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default AccountList;
