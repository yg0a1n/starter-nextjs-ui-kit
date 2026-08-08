import pkg from '../../package.json';

/**
 * Les versions affichées sont lues dans le `package.json`, jamais recopiées.
 *
 * Une version écrite à la main dans une traduction devient fausse au premier bump, sans
 * que rien ne le signale — et un projet cloné hérite alors du chiffre figé de son auteur.
 * Ce dépôt en a fait trois fois l'expérience : un README annonçant 15.3.6+ contre 15.3.8
 * épinglé, un nom de dépôt contenant « next15 » devenu faux à la montée en 16, et une URL
 * de base survivant à un renommage en pointant dans le vide.
 */

/** Ce que la page présente, dans cet ordre. Le libellé est le nom du paquet. */
const DISPLAYED = [
  'next',
  'react',
  'typescript',
  'tailwindcss',
  'next-intl',
  'shadcn',
  'hono',
  'next-themes'
] as const;

const dependencies: Record<string, string> = {
  ...pkg.dependencies,
  ...pkg.devDependencies
};

/** `^19.2.3` → `19.2.3` : la plage de compatibilité n'apprend rien au lecteur. */
function readableVersion(range: string): string {
  return range.replace(/^[\^~>=<\s]+/, '');
}

export type StackEntry = {
  name: string;
  version: string;
};

export function getStack(): StackEntry[] {
  return DISPLAYED.filter((name) => dependencies[name]).map((name) => ({
    name,
    version: readableVersion(dependencies[name])
  }));
}

/** Le gestionnaire de paquets, avec sa version, tel que déclaré par `packageManager`. */
export function getPackageManager(): string {
  return pkg.packageManager?.replace('@', ' ') ?? 'pnpm';
}

/**
 * Détection des grandes briques applicatives dans les dépendances.
 *
 * ATTENTION À CE QUE CETTE FONCTION PERMET DE DIRE. Une liste de paquets, si longue soit-elle,
 * ne prouve jamais une absence : elle ne couvre que ce qu'elle connaît. Un projet bâti sur
 * Supabase — un seul paquet pour l'authentification et la base de données — passerait au
 * travers de n'importe quelle liste qui ne l'anticipe pas.
 *
 * Une présence se prouve d'un seul test ; une absence exigerait d'épuiser un espace qu'on ne
 * peut pas énumérer. Ce qui suit autorise donc « aucun paquet connu détecté », jamais
 * « ce projet n'a pas d'authentification ». Les textes qui consomment cette fonction doivent
 * porter cette limite explicitement — sinon le calcul déplace le mensonge au lieu de le
 * supprimer, en lui donnant en prime l'apparence de la rigueur.
 */
const CAPABILITIES = [
  {
    label: 'authentication',
    packages: [
      'next-auth',
      '@auth/core',
      '@clerk/nextjs',
      'better-auth',
      'lucia',
      'passport',
      '@supabase/supabase-js',
      '@auth0/nextjs-auth0',
      'firebase',
      'firebase-admin',
      '@workos-inc/node',
      '@kinde-oss/kinde-auth-nextjs',
      '@descope/nextjs-sdk',
      'iron-session'
    ]
  },
  {
    label: 'database or ORM',
    packages: [
      'prisma',
      '@prisma/client',
      'drizzle-orm',
      'mongoose',
      'kysely',
      'typeorm',
      'sequelize',
      '@supabase/supabase-js',
      '@neondatabase/serverless',
      '@planetscale/database',
      '@vercel/postgres',
      'pg',
      'mysql2',
      'better-sqlite3',
      'postgres',
      'firebase-admin',
      'mongodb',
      '@libsql/client',
      'redis',
      'ioredis'
    ]
  },
  {
    label: 'payments',
    packages: [
      'stripe',
      '@stripe/stripe-js',
      '@lemonsqueezy/lemonsqueezy.js',
      '@paddle/paddle-js',
      '@paypal/react-paypal-js',
      '@paypal/checkout-server-sdk',
      'braintree',
      '@polar-sh/sdk'
    ]
  },
  {
    label: 'error monitoring',
    packages: [
      '@sentry/nextjs',
      '@sentry/node',
      '@highlight-run/next',
      '@bugsnag/js',
      'rollbar',
      'posthog-js',
      'posthog-node',
      '@datadog/browser-rum',
      'dd-trace',
      '@grafana/faro-web-sdk',
      '@logrocket/react',
      'logrocket'
    ]
  }
] as const;

export type CapabilityScan = {
  /** Capacités pour lesquelles AUCUN paquet connu n'a été trouvé. Pas une preuve d'absence. */
  undetected: string[];
  /** Capacités effectivement détectées, avec le paquet qui les a révélées. */
  detected: { label: string; via: string }[];
};

export function scanCapabilities(): CapabilityScan {
  const undetected: string[] = [];
  const detected: { label: string; via: string }[] = [];

  for (const { label, packages } of CAPABILITIES) {
    const via = packages.find((p) => dependencies[p]);
    if (via) {
      detected.push({ label, via });
    } else {
      undetected.push(label);
    }
  }

  return { undetected, detected };
}
