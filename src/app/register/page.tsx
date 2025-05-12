'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا ستتصل بالخدمة لاحقاً
    console.log('Registering with:', email, password);
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">{t('register')}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('email')}
            placeholder="example@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label={t('password')}
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth type="submit">
            {t('register')}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" className="text-green-600 hover:underline">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}