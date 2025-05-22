"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Button from "@/components/atoms/Button";
import useTranslation from "@/hooks/useTranslation";
import Cookies from "js-cookie";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { wsService } from "@/services/add_accounts";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const router = useRouter();

  const handleConnect = () => {
    const token = Cookies.get("access_token");
    if (!token) {
      alert("لم يتم العثور على التوكن");
      return;
    }

    setLoading(true);
    setSuccessMessage(null);

    // الاتصال بالسيرفر بدون إرسال clientId
    wsService.connect( () => {
      console.log("Socket.IO Connected");
    });

    wsService.on("qr", (data) => {
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      if (data.qr) {
        setQrImageUrl(data.qr);
        setLoading(false);
      }
    });

    wsService.on("authenticated", () => {
      console.log("✅ Authenticated event received");
    });

    wsService.on("ready", (data) => {
      console.log("🔔 WhatsApp client is ready:", data);
      setQrImageUrl(null);
      setLoading(false);
      setSuccessMessage(t("accountsPageSuccessMessage") || "تمت الإضافة بنجاح!");
      wsService.close();

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    });

    wsService.on("disconnected", (reason) => {
      console.warn("🔌 Disconnected:", reason);
      setLoading(false);
      alert("حدث انقطاع أثناء الاتصال: " + (reason || "سبب غير معروف"));
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
      {loading && <LoadingSpinner />}
      {qrImageUrl && (
        <div className="mt-6 text-center">
          <h2 className="text-lg mb-2">{t("accountsPagescanQrInstruction")}</h2>
          <div className="bg-white inline-block p-4 rounded shadow">
            <img src={qrImageUrl} alt="QR Code" width={250} height={250} />
          </div>
        </div>
      )}
      {successMessage && (
        <div className="mt-6 text-center text-green-600 font-semibold">
          {successMessage}
        </div>
      )}
    </Card>
  );
}
