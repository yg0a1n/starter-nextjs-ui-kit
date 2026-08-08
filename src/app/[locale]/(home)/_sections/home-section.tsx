'use client';

import { AUTHOR_WEBSITE_URL } from '@/config/app';
import { logPageView } from '@/lib/analytics/consent';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomeSection() {
  const t = useTranslations('HomePage');

  useEffect(() => {
    logPageView({
      title: t('title'),
      page: window.location.pathname,
      hitType: 'pageview'
    });
  }, [t]);

  return (
    <div className="min-h-screen w-full py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full min-h-[calc(100vh-12rem)] flex-col items-center justify-center lg:flex-row">
          <div className="flex w-full items-center px-2 sm:px-4 lg:w-2/3 lg:px-0">
            <div className="flex w-full flex-col items-start pr-2 sm:pr-4 lg:pr-12">
              <h1 className="w-full text-3xl font-bold text-gray-900 sm:text-4xl lg:w-auto dark:text-white">
                {t('title')}
              </h1>
              <p className="mt-4 w-full text-justify text-base text-gray-600 sm:mt-6 sm:text-lg lg:max-w-[80%] dark:text-gray-300">
                {t('description')}
              </p>
              <Link
                href={AUTHOR_WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-12 mb-8 cursor-pointer self-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 sm:mt-16 sm:mb-12 sm:text-lg lg:mt-8 lg:mb-0 lg:self-start"
              >
                {t('button')}
              </Link>
            </div>
          </div>

          <div className="flex w-full items-center justify-center px-2 sm:px-4 lg:w-1/3 lg:px-0">
            <div className="w-full pl-0 sm:pl-4 lg:pl-12">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src="/img/photos-with-graph.jpg"
                    alt="Data visualization and analytics dashboard"
                    width={400}
                    height={400}
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="h-full max-h-80 w-full max-w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="square relative mx-auto hidden w-full max-w-md overflow-hidden rounded-lg shadow-lg md:block lg:block">
                  <Image
                    src="/img/photos-with-ux-ui.jpg"
                    alt="UX/UI design workspace with modern interface"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <div className="relative mx-auto mt-4 hidden aspect-[16/9] max-w-2xl overflow-hidden rounded-lg shadow-lg md:block">
                <Image
                  src="/img/desktop-with-code.jpg"
                  alt="Modern development environment with code editor"
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
