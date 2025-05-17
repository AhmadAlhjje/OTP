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
  const { t } = useTranslation();

  const handleConnect = () => {
    const token = Cookies.get("access_token");
    if (!token) {
      alert("لم يتم العثور على التوكن");
      return;
    }

    const clientId = extractClientIdFromToken(token);
    if (!clientId) {
      alert("تعذر استخراج clientId من التوكن");
      return;
    }

    setLoading(true);

    wsService.connect(clientId, () => {
      console.log("Socket.IO Connected");
    });

    wsService.on("qr", (data) => {
      console.log(data)
      // استقبل رابط صورة QR
      if (data.qr) {
        setQrImageUrl(data.qr);
        setLoading(false);
      }
    });

    wsService.on("authenticated", () => {
      setQrImageUrl(null);
      wsService.close();
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
    </Card>
  );
}

function extractClientIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch (error) {
    console.error("فشل استخراج clientId من التوكن:", error);
    return null;
  }
}
