import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.description')}</p>
      <Link href="/">{t('notFound.home')}</Link>
    </div>
  );
}