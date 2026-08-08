import '../styles/globals.css';
import { AUTHOR_NAME } from '@/config/app';
import { siteConfig } from '@/config/site';
import { env } from '@/env';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { localizedUrl, pageAlternates } from '@/lib/seo-urls';
import { cn } from '@/lib/utils';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

const geistSans = localFont({
  src: '../styles/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: '../styles/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  // Accueil : canonical `/` (URL réellement servie ; `/fr` redirige et s'annulerait) + hreflang par
  // langue + x-default, via la fonction de composition unique (src/lib/seo-urls).
  alternates: pageAlternates(DEFAULT_LOCALE),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: localizedUrl(DEFAULT_LOCALE),
    siteName: siteConfig.name,
    images: [
      {
        url: `${env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.altOgImage
      }
    ],
    locale: 'fr',
    type: 'website'
  },
  authors: [{ name: AUTHOR_NAME }],
  keywords: siteConfig.keywords,
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: siteConfig.icons.icon,
    apple: siteConfig.icons.apple
  }
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColors
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="system h-full" lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'bg-background text-foreground h-full overscroll-none antialiased'
        )}
      >
        {children}
      </body>
    </html>
  );
}
