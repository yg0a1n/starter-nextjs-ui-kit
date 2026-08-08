import NavigationLinks from '@/components/navigation/header/navigation-links';
import { GITHUB_REPO } from '@/config/app';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <nav className="mx-auto mt-3 flex w-full max-w-7xl flex-row items-center justify-between gap-6 px-4 sm:flex-row sm:px-0 lg:mt-6 lg:px-8">
        <div className="flex flex-1 justify-start">
          <NavigationLinks />
        </div>
        <div className="flex w-full flex-1 justify-end gap-6 sm:w-auto sm:items-center">
          {/*
            Ce lien ne contient que des <svg> : sans `aria-label`, son nom
            accessible est vide et un lecteur d'ecran annonce « lien » sans dire
            vers quoi. `rel` accompagne `target="_blank"` — sans `noopener`, la
            page ouverte peut manipuler celle d'origine via `window.opener`.
          */}
          <Link
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${GITHUB_REPO} sur GitHub`}
          >
            <svg className="block dark:hidden" width="24" height="24" aria-hidden="true">
              <use href="/icons/nav-icons.svg#github-black" />
            </svg>
            <svg className="hidden dark:block" width="24" height="24" aria-hidden="true">
              <use href="/icons/nav-icons.svg#github-white" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
