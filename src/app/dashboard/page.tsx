// "use client";

// import React from "react";
// import Card from "../../components/molecules/Card";
// import Button from "../../components/atoms/Button";
// import useTranslation from "@/hooks/useTranslation";

// export default function DashboardPage() {
//   const { t } = useTranslation();
//   return (
//     <div className="p-6">
//       {/* Cards */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <Card
//           title={t("dashboardsupport_cards")}
//           count={0}
//           color="red-500"
//           icon={<span>🎫</span>}
//           actionText={t("dashboardsend_support_card")}
//           onActionClick={() => alert(t("dashboardsend_support_card"))}
//         />
//         <Card
//           title={t("dashboardaddress_book")}
//           count={0}
//           color="yellow-500"
//           icon={<span>📞</span>}
//           actionText={t("dashboardmanage_groups")}
//           onActionClick={() => alert(t("dashboardmanage_groups"))}
//         />
//         <Card
//           title={t("dashboardbalance")}
//           count={0}
//           color="teal-500"
//           icon={<span>💰</span>}
//           actionText={t("dashboardadd_balance")}
//           onActionClick={() => alert(t("dashboardadd_balance"))}
//         />
//         <Card
//           title={t("dashboardwhatsapp_accounts")}
//           count={0}
//           color="green-500"
//           icon={<span>💬</span>}
//           actionText={t("dashboardrequest_whatsapp_account")}
//           onActionClick={() => alert(t("dashboardrequest_whatsapp_account"))}
//         />
//       </div> */}

//       {/* Buttons */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <Button className="bg-red-500 text-white dark:bg-red-700 dark:hover:bg-red-800">
//           + {t("dashboardsend_support_card")}
//         </Button>
//         <Button className="bg-yellow-500 text-white dark:bg-yellow-700 dark:hover:bg-yellow-800">
//           + {t("dashboardmanage_groups")}
//         </Button>
//         <Button className="bg-teal-500 text-white dark:bg-teal-700 dark:hover:bg-teal-800">
//           + {t("dashboardadd_balance")}
//         </Button>
//         <Button className="bg-green-500 text-white dark:bg-green-700 dark:hover:bg-green-800">
//           + {t("dashboardrequest_whatsapp_account")}
//         </Button>
//       </div> */}
//     </div>
//   );
// }