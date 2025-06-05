import { useCallback, useEffect, useState } from "react";

type AccountUpdateContextType = {
  accountsUpdated: boolean;
  refreshAccounts: () => void;
};

const listeners: (() => void)[] = [];

export const useAccountUpdate = (): AccountUpdateContextType => {
  const [accountsUpdated, setAccountsUpdated] = useState(false);

  const refreshAccounts = useCallback(() => {
    setAccountsUpdated((prev) => !prev);
    // Notify all components listening
    listeners.forEach((cb) => cb());
  }, []);

  return {
    accountsUpdated,
    refreshAccounts,
  };
};

// Hook to subscribe to account updates
export const useOnAccountUpdate = (callback: () => void) => {
  useEffect(() => {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [callback]);
};