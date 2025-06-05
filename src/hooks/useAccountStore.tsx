// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface Account {
//   id: string;
//   name: string;
// }

// interface AccountState {
//   selectedAccount: Account | null;
//   setSelectedAccount: (account: Account | null) => void;
// }

// export const useAccountStore = create(
//   persist<AccountState>(
//     (set) => ({
//       selectedAccount: null,
//       setSelectedAccount: (account) => set({ selectedAccount: account }),
//     }),
//     {
//       name: 'account-storage', // سيتم حفظه في localStorage
//     }
//   )
// );
