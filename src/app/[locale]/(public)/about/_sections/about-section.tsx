import { SOURCE_CODE_URL } from '@/config/app';
import { getPackageManager, getStack, scanCapabilities } from '@/lib/stack';
import { getTranslations } from 'next-intl/server';

/**
 * Page « à propos » d'un kit de démarrage : elle répond à la question que se pose son
 * lecteur — est-ce que ce kit fait ce dont j'ai besoin, et qu'est-ce qu'il m'impose en
 * échange ? D'où l'ordre : la réponse courte, les faits vérifiables, ce qui est écarté,
 * puis comment démarrer.
 *
 * Les versions viennent du `package.json` (voir `@/lib/stack`) : rien d'affirmé ici ne peut
 * devenir faux au prochain bump.
 *
 * La locale est reçue en prop et passée explicitement à `getTranslations`, plutôt que lue
 * dans le contexte de requête via `useTranslations`. Les autres sections du projet peuvent
 * s'appuyer sur ce contexte parce qu'elles sont rendues côté client, où le provider du
 * layout le leur fournit ; celle-ci est un composant serveur — elle lit le `package.json`,
 * qui n'a rien à faire dans le paquet envoyé au navigateur. Sur une page pré-rendue, ce
 * contexte s'est révélé peu fiable : les deux locales se sont retrouvées à servir l'anglais.
 * Une locale passée en argument ne peut pas se tromper.
 */
export default async function AboutSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  const stack = getStack();
  const { detected } = scanCapabilities();

  return (
    <section className="mt-12 mb-12 w-full max-w-3xl rounded-2xl bg-white px-4 py-12 shadow-lg lg:px-8 dark:bg-black dark:shadow-md dark:shadow-white">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('lead')}</p>
      </header>

      {/* Ce que vous obtenez — versions lues dans le package.json */}
      <div className="mb-12">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
          {t('stackTitle')}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{t('stackIntro')}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="col" className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                  {t('stackColBrick')}
                </th>
                <th scope="col" className="py-2 font-medium text-gray-500 dark:text-gray-400">
                  {t('stackColVersion')}
                </th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {stack.map(({ name, version }) => (
                <tr key={name} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">{name}</td>
                  <td className="py-2 tabular-nums text-gray-600 dark:text-gray-300">{version}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 pr-4 font-sans text-gray-900 dark:text-gray-100">
                  {t('packageManagerLabel')}
                </td>
                <td className="py-2 text-gray-600 dark:text-gray-300">{getPackageManager()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Les décisions déjà prises */}
      <div className="mb-12">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
          {t('decisionsTitle')}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{t('decisionsIntro')}</p>
        <dl className="flex flex-col gap-5">
          {[
            { k: 'I18n', title: t('decisionI18nTitle'), body: t('decisionI18nBody') },
            { k: 'Docker', title: t('decisionDockerTitle'), body: t('decisionDockerBody') },
            { k: 'Shadcn', title: t('decisionShadcnTitle'), body: t('decisionShadcnBody') },
            { k: 'Pnpm', title: t('decisionPnpmTitle'), body: t('decisionPnpmBody') }
          ].map(({ k, title, body }) => (
            <div key={k}>
              <dt className="font-semibold text-gray-900 dark:text-white">{title}</dt>
              <dd className="mt-1 text-gray-600 dark:text-gray-300">{body}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Ce qui n'est pas inclus — un choix assumé, pas un manque.
          La détection ne prouve pas une absence : elle ne connaît qu'une liste de paquets
          courants. D'où l'ordre — l'intention du kit, puis ce qui est réellement détecté,
          puis la limite de la méthode. */}
      <div className="mb-12">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
          {t('excludedTitle')}
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">{t('excludedBody')}</p>
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
          {t('excludedDetectedLabel')}
        </h3>
        {detected.length > 0 ? (
          <ul className="mb-4 list-disc pl-5 text-gray-600 dark:text-gray-300">
            {detected.map(({ label, via }) => (
              <li key={label}>
                {label} — <code className="font-mono text-sm">{via}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-gray-600 dark:text-gray-300">{t('excludedDetectedNone')}</p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('excludedCaveat')}</p>
      </div>

      {/* La page se démontre elle-même */}
      <div className="mb-12">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
          {t('demoTitle')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t('demoBody')}</p>
      </div>

      {/* Démarrer, et où personnaliser */}
      <div>
        <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
          {t('startTitle')}
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">{t('startBody')}</p>
        <pre className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <code>pnpm install{'\n'}pnpm dev</code>
        </pre>
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
          {t('startConfigTitle')}
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{t('startConfigBody')}</p>
        <a
          href={SOURCE_CODE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block font-medium text-gray-900 underline underline-offset-4 dark:text-white"
        >
          {t('repoLink')}
        </a>
      </div>
    </section>
  );
}
