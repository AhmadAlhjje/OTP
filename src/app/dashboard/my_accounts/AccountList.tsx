"use client";

import { useEffect, useState } from "react";
import AccountCard from "@/components/molecules/AccountCard";
import useTranslation from "@/hooks/useTranslation";
import {
  getWhatsappAccounts,
  deleteWhatsappAccount,
} from "@/services/my_accounts";
import { useToast } from "@/hooks/useToast";

interface AccountListProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

const AccountList = ({ onLoadingChange }: AccountListProps) => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<
    { id: string; name: string; phone: string }[]
  >([]);
  const { showToast } = useToast();

  useEffect(() => {
    onLoadingChange?.(true);
    getWhatsappAccounts().then((data) => {
      setAccounts(data);
      onLoadingChange?.(false);
    });
  }, [onLoadingChange]);

  const handleDelete = async (id: string) => {
    onLoadingChange?.(true);

    try {
      await deleteWhatsappAccount(id);
      setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    } catch (error:any) {
      console.error("فشل في حذف الحساب:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("registrationFailed");

      showToast(errorMessage, "error");
    } finally {
      onLoadingChange?.(false);
    }
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
