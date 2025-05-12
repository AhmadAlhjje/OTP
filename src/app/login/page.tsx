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
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      {/* Header with WhatsApp logo */}
      <div className="w-full max-w-md">
        <div className="bg-green-600 text-white py-4 px-6 rounded-t-xl flex items-center space-x-3 shadow-md">
          <div className="text-2xl">💬</div> 
          <h1 className="text-xl font-bold">WhatsApp</h1>
        </div>

        <div className="bg-white p-8 rounded-b-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('login')}</h2>

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
            <Link href="/register" className="text-green-600 hover:underline font-medium">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}