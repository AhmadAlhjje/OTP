import { useEffect, useState } from 'react';
import useLanguage from './useLanguage';

// استيراد ملفات الترجمة
import ar from '../../public/locales/ar';
import en from '../../public/locales/en';

type TranslationValue = string | { [key: string]: string };
type Translations = Record<string, TranslationValue>;

const resources: Record<string, Translations> = {
  ar,
  en,
};

export default function useTranslation() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translations>(resources[language]);

  useEffect(() => {
    setTranslations(resources[language]);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
  };

  return { t };
}