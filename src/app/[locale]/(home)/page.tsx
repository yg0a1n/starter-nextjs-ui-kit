import HomeSection from '@/app/[locale]/(home)/_sections/home-section';
import { LOCALES } from '@/i18n/routing';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function Page() {
  return <HomeSection />;
}
