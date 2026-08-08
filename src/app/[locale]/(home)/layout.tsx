import Footer from '@/app/[locale]/_footer/footer';
import Header from '@/app/[locale]/_header/header';
import { ReactNode } from 'react';

export default async function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Header />
      <div className="flex flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
