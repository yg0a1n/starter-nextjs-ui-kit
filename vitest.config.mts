import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resout les alias `@/...` du tsconfig, nativement depuis Vite 8.
    tsconfigPaths: true,
    alias: {
      // `client-only` et `server-only` sont des marqueurs que Next resout au
      // bundling : ils n'existent pas pour un runtime nu. Les aliaser vers un
      // module vide permet de tester les fichiers qui les importent.
      'client-only': new URL('./test/stubs/empty.ts', import.meta.url).pathname,
      'server-only': new URL('./test/stubs/empty.ts', import.meta.url).pathname,
      // next-intl construit ses helpers de navigation a l'import de
      // `@/i18n/routing`, d'ou une dependance vers `next/navigation` que Node
      // seul ne resout pas. Les tests portent sur la composition d'URL, pas sur
      // la navigation : un stub suffit.
      'next/navigation': new URL('./test/stubs/next-navigation.ts', import.meta.url).pathname
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    server: {
      deps: {
        // Sans inline, next-intl est charge tel quel depuis node_modules et les
        // alias ci-dessus ne s'y appliquent pas.
        inline: ['next-intl']
      }
    },
    // src/env.ts valide ces variables au chargement : sans elles, tout import
    // transitif de la config fait echouer la suite.
    env: {
      NEXT_PUBLIC_APP_URL: 'https://example.test',
      NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: ''
    }
  }
});
