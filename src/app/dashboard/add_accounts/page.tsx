"use client";
import { useState } from "react";
import { useAccountUpdate } from "@/hooks/useAccountUpdate";
import { Card } from "@/components/ui/card";
import Button from "@/components/atoms/Button";
import useTranslation from "@/hooks/useTranslation";
import Cookies from "js-cookie";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { wsService } from "@/services/add_accounts";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export default function AccountsPage() {
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // طلب QR فقط
  const [finalLoading, setFinalLoading] = useState(false); // التحضير النهائي
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();
  const { refreshAccounts } = useAccountUpdate();

  const handleConnect = () => {
    const token = Cookies.get("access_token");
    if (!token) {
      showToast(t("failed_fetch_scheduled_messages"), "error");
      return;
    }

    setLoading(true);
    setFinalLoading(false);
    setQrImageUrl(null);

    wsService.connect(() => {
      console.log("Socket.IO Connected");
    });

    wsService.on("qr", (data) => {
      if (data.qr) {
        setQrImageUrl(data.qr);
        setLoading(false); // انتهاء مرحلة طلب QR
      }
    });

    wsService.on("authenticated", () => {
      console.log("✅ Authenticated event received");
    });

    wsService.on("loading_status", (data) => {
      if (data.loading) {
        setFinalLoading(true); // بدء التحميل النهائي
        // setQrImageUrl(null);  
      }
    });

    wsService.on("ready", (data) => {
      console.log("🔔 WhatsApp client is ready:", data);
      setFinalLoading(false);
      refreshAccounts();
      showToast(t("added_successfully"), "success");
      setTimeout(() => {
        router.push("/dashboard/send_whatsapp");
      }, 1000);
    });

    wsService.on("disconnect", () => {
      console.log("Socket.IO Disconnected");
    });
  };

  return (
    <Card>
      <h1 className="text-xl dark:text-white font-semibold mb-4">
        {t("accountsPagetitle")}
      </h1>
      <Button className="w-full" onClick={handleConnect}>
        {t("accountsPageconnectButton")}
      </Button>

      {/* تحميل أولي - طلب QR */}
      {loading && <LoadingSpinner message={t("requesting_qr")} size="lg" />}

      {/* QR Code */}
      {qrImageUrl && (
        <div className="mt-6 text-center">
          <h2 className="text-lg mb-2">{t("accountsPagescanQrInstruction")}</h2>
          <div className="bg-white inline-block p-4 rounded shadow">
            <img src={qrImageUrl} alt="QR Code" width={250} height={250} />
          </div>
        </div>
      )}

      {/* تحميل نهائي - جاري التحضير... */}
      {finalLoading && (
        <LoadingSpinner
          message={t("preparing_account")}
          size="md"
          color="green"
        />
      )}
    </Card>
  );
}