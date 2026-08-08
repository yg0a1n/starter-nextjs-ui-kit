/**
 * Captures d'ecran du starter, pour le README.
 *
 *   pnpm build && pnpm screenshots
 *
 * Le serveur doit tourner sur PORT (3000 par defaut). Les images sont ecrites
 * dans docs/screenshots/ et versionnees : c'est ce que voit un visiteur de la
 * page GitHub avant de cloner quoi que ce soit.
 *
 * Le theme sombre est force via l'emulation `prefers-color-scheme`, et non par
 * un clic sur le selecteur : la capture ne depend ainsi d'aucun etat persiste.
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:3000';
const OUT = 'docs/screenshots';

const shots = [
  { name: 'home-light', path: '/', theme: 'light' },
  { name: 'home-dark', path: '/', theme: 'dark' },
  { name: 'about', path: '/about', theme: 'light' }
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

for (const shot of shots) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: shot.theme,
    deviceScaleFactor: 2 // rendu net sur ecran haute densite
  });
  const page = await context.newPage();

  await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' });

  // La banniere de consentement recouvre le bas de la page : elle est fermee
  // pour que la capture montre le contenu, pas le bandeau.
  const reject = page.getByRole('button', { name: /refuser|reject/i });
  if (await reject.count()) {
    await reject.first().click();
    await page.waitForTimeout(300);
  }

  await page.screenshot({ path: `${OUT}/${shot.name}.png`, fullPage: false });
  console.log(`ecrit ${OUT}/${shot.name}.png`);

  await context.close();
}

await browser.close();
