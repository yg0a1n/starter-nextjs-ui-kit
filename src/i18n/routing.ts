import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

// Routing constants must be defined here to avoid circular dependencies with next-intl
export const LOCALES = ['fr', 'en'];
export const DEFAULT_LOCALE = 'fr';
export const IS_LOCALE_DETECTION = false;
export const LOCALE_NAMES: Record<string, string> = {
  fr: 'Français',
  en: 'English'
};

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,

  // auto detect locale
  localeDetection: IS_LOCALE_DETECTION,

  localePrefix: 'as-needed'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export type Locale = (typeof routing.locales)[number];
