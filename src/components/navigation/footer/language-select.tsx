'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const LANGUAGES = [
  { code: 'fr', label: '🇫🇷' },
  { code: 'en', label: '🇺🇸' }
];

const getCurrentLocale = (pathname: string) => {
  const segments = pathname.split('/');
  if (segments[1] === 'fr' || segments[1] === 'en') {
    return segments[1];
  }
  return 'fr'; // fallback
};

const LanguageSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getCurrentLocale(pathname);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = pathname.split('/');
    if (segments[1] === 'fr' || segments[1] === 'en') {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.replace(segments.join('/'));
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="rounded border bg-white px-2 py-1 text-lg shadow focus:outline-none dark:bg-gray-900 dark:text-white"
      aria-label="Choisir la langue"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelect;
