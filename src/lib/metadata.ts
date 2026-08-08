import { siteConfig } from '@/config/site';
import { pageAlternates } from '@/lib/seo-urls';
import { MetadataProps } from '@/types/metadata-props';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function constructMetadata({
  page = 'Home',
  title,
  description,
  images = [],
  noIndex = false,
  locale,
  path,
  canonicalUrl
}: MetadataProps): Promise<Metadata> {
  // get translations
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  // get page specific metadata translations
  const pageTitle = title || t(`title`);
  const pageDescription = description || t(`description`);

  // build full title
  const finalTitle =
    page === 'Home' ? `${pageTitle} - ${t('tagLine')}` : `${pageTitle} | ${t('title')}`;

  // build image URLs
  const imageUrls =
    images.length > 0
      ? images.map((img) => ({
          url: img.startsWith('http') ? img : `${siteConfig.url}/${img}`,
          alt: pageTitle
        }))
      : [
          {
            url: `${siteConfig.url}/og.png`,
            alt: pageTitle
          }
        ];

  // Canonical + hreflang via la fonction de composition UNIQUE (src/lib/seo-urls). Les pages passent
  // `path` (ex. `/about`) ; `canonicalUrl` reste un override optionnel. Home => chemin vide.
  const { canonical, languages } = pageAlternates(locale, canonicalUrl ?? path ?? '');

  return {
    title: finalTitle,
    description: pageDescription,
    keywords: siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
      languages
    },
    openGraph: {
      type: 'website',
      title: finalTitle,
      description: pageDescription,
      url: canonical,
      siteName: t('title'),
      locale: locale,
      images: imageUrls
    },
    twitter: {
      // `twitter.site`/`twitter.creator` attendent un identifiant @compte, pas une URL. La config n'en
      // fournit pas (seulement une URL de profil) : on n'invente pas de handle, on omet le champ.
      card: 'summary_large_image',
      title: finalTitle,
      description: pageDescription,
      images: imageUrls
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex
      }
    }
  };
}
