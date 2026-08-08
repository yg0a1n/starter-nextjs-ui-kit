// Next.js 16 : `@next/eslint-plugin-next` / `eslint-config-next` sont désormais des FLAT configs.
// On les consomme directement (plus de FlatCompat, qui provoquait un « Converting circular
// structure to JSON » en chargeant un flat config via la couche legacy `@eslint/eslintrc`).
// `core-web-vitals` embarque react + react-hooks + next (recommended) ; `typescript` ajoute
// les règles typescript-eslint. Voir /docs/app/api-reference/config/eslint.
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    }
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']
  }
];

export default eslintConfig;
