"use client";

import { useEffect, useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { wsService } from "@/services/add_accounts";
import useTranslation from "@/hooks/useTranslation";
import QRCode from "react-qr-code";

export default function AccountsPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  // دالة الاتصال بالخادم
  const handleConnect = () => {
    wsService.connect(() => {
      wsService.send({ type: "register-phone", phone: phoneNumber });
    });

    // الاستماع للرسائل القادمة من السيرفر
    wsService.onMessage((data) => {
      if (data.type === "qr-url") {
        setQrUrl(data.qr);
      }
    });
  };

  // إغلاق الاتصال عند مغادرة الصفحة
  useEffect(() => {
    return () => {
      wsService.close();
    };
  }, []);

  return (
    <Card>
      <h1 className="text-xl dark:text-white font-semibold mb-4">
        {t("accountsPagetitle")}
      </h1>

      <Input
        type="text"
        placeholder={t("accountsPagephonePlaceholder")}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <Button className="mt-4 w-full" onClick={handleConnect}>
        {t("accountsPageconnectButton")}
      </Button>

      {qrUrl && (
        <div className="mt-6 text-center">
          <h2 className="text-lg mb-2">{t("accountsPagescanQrInstruction")}</h2>
          <div
            style={{
              background: "white",
              padding: "16px",
              display: "inline-block",
            }}
          >
            <QRCode value={qrUrl} size={250} />
          </div>
        </div>
      )}
    </Card>
  );
}
