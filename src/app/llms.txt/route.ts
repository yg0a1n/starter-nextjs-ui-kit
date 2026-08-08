import { SOURCE_CODE_URL } from '@/config/app';
import { siteConfig } from '@/config/site';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing';
import { getPackageManager, getStack, scanCapabilities } from '@/lib/stack';

/**
 * `/llms.txt` — carte du projet pour les agents qui cherchent ce fichier avant d'ingérer un
 * site : assistants de code, agents de navigation, serveurs MCP.
 *
 * À ne pas confondre avec un levier d'indexation : Google a explicitement écarté ce format,
 * et il ne représente qu'une part négligeable du trafic des crawlers. Sa valeur tient à
 * l'autre lecteur — un agent qui doit décider si ce kit convient obtient ici la réponse sans
 * parcourir les pages ni le dépôt.
 *
 * Tout est dérivé de `siteConfig`, `config/app.ts` et du `package.json` : rien à maintenir en
 * double, et surtout rien qui devienne faux après clonage. Un projet issu de ce gabarit sert
 * sa propre description, ses propres versions, et cesse d'annoncer « pas de base de données »
 * le jour où il en ajoute une.
 *
 * Pour personnaliser : `src/config/app.ts`. Rien à modifier ici.
 */
export const dynamic = 'force-static';

const origin = siteConfig.url.replace(/\/+$/, '');

function localizedPath(path: string): string {
  return LOCALES.map(
    (locale) => `- [${locale}](${locale === DEFAULT_LOCALE ? origin : `${origin}/${locale}`}${path})`
  ).join('\n');
}

export function GET() {
  const stack = getStack()
    .map(({ name, version }) => `- ${name} ${version}`)
    .join('\n');

  const { undetected, detected } = scanCapabilities();

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

A starting point, not a finished product: clone it, change one configuration file, ship.
Everything below is read from this project's own sources, so it stays accurate in a clone.

## What it ships

${stack}
- package manager: ${getPackageManager()}
- languages: ${LOCALES.join(', ')} (default: ${DEFAULT_LOCALE})

## What the template deliberately leaves out

The kit ships no authentication, database, payment or error-monitoring layer. Those are
architectural choices left to whoever uses it — bundling them would hand you dependencies you
never picked.

### Detected in this project

${
  detected.length > 0
    ? detected.map(({ label, via }) => `- ${label} — via \`${via}\``).join('\n')
    : '- none of the layers below'
}

${
  undetected.length > 0
    ? `### Not detected

No known package was found for:
${undetected.map((c) => `- ${c}`).join('\n')}

Read this as a strong hint, not as proof. The check matches a curated list of common packages
and cannot cover every option — a project built on a tool the list does not know about would
appear here even though it does use one. Trust the dependency list in \`package.json\` over
this section.`
    : ''
}

## Pages

### Home
${localizedPath('')}

### About — what the kit contains, the decisions it makes, what it leaves out
${localizedPath('/about')}

### Privacy policy
${localizedPath('/privacy-policy')}

### Terms of service
${localizedPath('/terms-of-service')}

## Source

- [Repository](${SOURCE_CODE_URL})
- [License](${SOURCE_CODE_URL}/blob/main/LICENSE)

## Notes for agents

- This site is a project template. Its content describes the template itself, and a project
  cloned from it will serve its own name, description and versions — read them here rather
  than assuming the values of the original.
- Identity, URLs and metadata come from a single file, \`src/config/app.ts\`.
- Structured data (WebSite, SoftwareSourceCode, BreadcrumbList) is embedded in the HTML of
  each page, server-rendered.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
