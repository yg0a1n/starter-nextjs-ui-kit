import CopyrightNotice from '@/components/navigation/footer/copyright-notice';
import LanguageSelect from '@/components/navigation/footer/language-select';
import SitemapLinks from '@/components/navigation/footer/sitemap-links';
import SocialLinks from '@/components/navigation/footer/social-links';

export default function Footer() {
  return (
    <div className="border-t border-gray-200 bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <footer className="border-t border-gray-300 pt-2 pb-4 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-1 sm:items-start">
              <LanguageSelect />
              <SocialLinks />
            </div>
            <div className="ml-4 flex justify-center sm:mt-8 sm:ml-0 sm:flex-1 md:flex-none lg:mt-0">
              <SitemapLinks />
            </div>
          </div>
        </div>
        <CopyrightNotice />
      </footer>
    </div>
  );
}
