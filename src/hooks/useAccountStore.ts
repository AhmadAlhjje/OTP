// import { create } from "zustand";

// // نوع الحساب النشط
// interface ActiveAccount {
//   id?: string | null;
//   name?: string | null;
//   phone?: string | null;
// }

// // نوع الحالة
// interface AccountState {
//   activeAccount: ActiveAccount | null;
//   setActiveAccount: (account: ActiveAccount | null) => void;
// }

// // ← قراءة البيانات من localStorage
// const getInitialAccount = (): ActiveAccount | null => {
//   if (typeof window === "undefined") return null;
//   const saved = localStorage.getItem("activeAccount");
//   return saved ? JSON.parse(saved) : null;
// };

// export const useAccountStore = create<AccountState>((set) => ({
//   activeAccount: getInitialAccount(), // ← قراءة من localStorage
//   setActiveAccount: (account) =>
//     set(() => {
//       if (account) {
//         localStorage.setItem("activeAccount", JSON.stringify(account));
//       } else {
//         localStorage.removeItem("activeAccount");
//       }
//       return { activeAccount: account };
//     }),
// }));