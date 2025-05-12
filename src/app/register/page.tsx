'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering:', { name, email, phone, password });
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('register')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('name')}
              placeholder="John Doe"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label={t('email')}
              placeholder="example@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label={t('phone')}
              placeholder="+962 79 123 4567"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            <Link href="/login" className="text-green-600 hover:underline font-medium">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}