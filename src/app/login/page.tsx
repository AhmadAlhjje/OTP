'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Link from 'next/link';

export default function LoginPage() {
  const { t } = useTranslation();
  const [emailOrName, setEmailOrName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { emailOrName, password });
    // هنا سيتم الاتصال بـ API لاحقاً
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">{t('login')}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Name"
            placeholder="example@example.com or JohnDoe"
            type="text"
            value={emailOrName}
            onChange={(e) => setEmailOrName(e.target.value)}
          />

          <Input
            label={t('password')}
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth type="submit">
            {t('login')}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t('noAccountYet')}{' '}
          <Link href="/register" className="text-green-600 hover:underline">
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
}