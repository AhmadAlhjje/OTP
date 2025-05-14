'use client';

import { useEffect, useState } from 'react';
import  Input  from '@/components/atoms/Input';
import  Button  from '@/components/atoms/Button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { wsService } from '@/services/whatsapp_service';

export default function AccountsPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  // دالة الاتصال بالخادم
  const handleConnect = () => {
    wsService.connect(() => {
      wsService.send({ type: 'register-phone', phone: phoneNumber });
    });

    // الاستماع للرسائل القادمة من السيرفر
    wsService.onMessage((data) => {
      if (data.type === 'qr-url') {
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
      <h1 className="text-xl dark:text-white font-semibold mb-4">ربط حساب واتساب</h1>

      <Input
        type="text"
        placeholder="رقم الهاتف"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <Button className="mt-4 w-full" onClick={handleConnect}>
        اتصال
      </Button>

      {qrUrl && (
        <div className="mt-6">
          <h2 className="text-lg mb-2">امسح الكود باستخدام واتساب</h2>
          <Image
            src={qrUrl}
            alt="QR Code"
            width={250}
            height={250}
            className="mx-auto"
          />
        </div>
      )}
    </Card>
  );
}
