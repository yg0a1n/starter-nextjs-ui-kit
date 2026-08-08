'use client';

import { siteConfig } from '@/config/site';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { SiBluesky } from 'react-icons/si';

const SocialLinks = () => {
  const t = useTranslations('Footer');

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
      {/*
        `h2` et non `h3` : la page n'a qu'un `h1`, sauter au niveau 3 casse la
        hierarchie. Un lecteur d'ecran s'en sert pour naviguer de section en
        section ; un niveau manquant lui fait annoncer la sous-section d'un titre
        qui n'existe pas.
      */}
      <h2 className="ml-4 w-full text-center text-lg font-semibold sm:text-left">
        {t('social-links')}
      </h2>
      <br />
      <Link
        href={siteConfig.socialLinks?.github}
        target="_blank"
        rel="noreferrer nofollow noopener"
        aria-label="Github"
        title="View on Github"
        className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md"
      >
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#github" />
        </svg>
      </Link>
      <Link
        href={siteConfig.socialLinks?.bluesky}
        target="_blank"
        rel="noreferrer nofollow noopener"
        aria-label="Blue Sky"
        title="View on Bluesky"
        className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md"
      >
        <SiBluesky className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link
        href={siteConfig.socialLinks?.twitterx}
        target="_blank"
        rel="noreferrer nofollow noopener"
        aria-label="TwitterX"
        title="View on TwitterX"
        className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md"
      >
        <svg className="h-4 w-4" width="24" height="24">
          <use href="/icons/social-icons.svg#twitterx" />
        </svg>
      </Link>
      <Link
        href={siteConfig.socialLinks?.email}
        target="_blank"
        rel="noreferrer nofollow noopener"
        aria-label="Email"
        title="Email"
        className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md"
      >
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#mail" />
        </svg>
      </Link>
      <Link
        href={siteConfig.socialLinks?.linkedin}
        target="_blank"
        rel="noreferrer nofollow noopener"
        aria-label="LinkedIn"
        title="View on LinkedIn"
        className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md"
      >
        <svg className="h-4 w-4">
          <use href="/icons/social-icons.svg#linkedin" />
        </svg>
      </Link>
      <Link
        href={siteConfig.socialLinks?.telegram}
        target="_blank"
        rel="noreferrer nofollow noopener"
        aria-label="Telegram"
        title="View on Telegram"
        className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md"
      >
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#telegram" />
        </svg>
      </Link>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#discord" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#wechat" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-4 w-4">
          <use href="/icons/social-icons.svg#facebook" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#instagram" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#tiktok" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-6 w-6">
          <use href="/icons/social-icons.svg#reddit" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#snapchat" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#youtube" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#pinterest" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#messenger" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#medium" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#stackoverflow" />
        </svg>
      </div>
      <div className="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md">
        <svg className="h-5 w-5">
          <use href="/icons/social-icons.svg#slack" />
        </svg>
      </div>
    </div>
  );
};

export default SocialLinks;
