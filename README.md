# Next.js Production Starter

A Next.js 16 starting point that already answers the questions you would otherwise
answer on day three: two languages, cookie consent wired before analytics, SEO metadata
and JSON-LD derived from config, a quality gate in CI, and a production container image.

**Live demo → [starter-nextjs-ui-kit.vercel.app](https://starter-nextjs-ui-kit.vercel.app)**
· The [about page](https://starter-nextjs-ui-kit.vercel.app/about) reads exact versions
from `package.json` at build time, so they cannot go stale.

---

## Decisions

The parts of this repository worth reading are the choices, not the boilerplate.

### Three dependencies are pinned on purpose

They are not oversights, and Dependabot is configured to stop proposing their major
upgrades until the conditions below are met.

| Package | Held at | Latest | Why |
|---|---|---|---|
| `typescript` | 5.x | 7.0.2 | `typescript-eslint` does not support TS 7 |
| `eslint` | 9.x | 10.8.1 | same toolchain constraint |
| `@types/node` | 22.x | 26.x | must match the Node major actually running (`.nvmrc`) |

Upgrading TypeScript or ESLint stops linting entirely:

```
$ eslint .
typescript-eslint does not support TS 7.0.
```

The failure happens when the module loads, before a single file is analysed. No change in
this repository can work around it — the constraint is upstream. Both pins lift together
once [typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)
ships.

`@types/node` is different: type definitions must describe the runtime you actually
execute. `.nvmrc` and CI run Node 22; types from Node 26 would describe APIs that do not
exist at runtime, and `tsc` would accept them without a word. This pin lifts when `.nvmrc`
moves.

Minor and patch updates keep flowing for all three. Each `ignore` rule in
`.github/dependabot.yml` states the condition for removing it.

### CI runs on `pull_request`, never `pull_request_target`

`pull_request_target` executes with the base repository's context — secrets and a write
token. Combined with a checkout of the pull request's code, anyone opening a pull request
on a public repository would run their own code with those rights. With `pull_request`,
fork pull requests run without secrets and read-only.

### Consent comes before analytics, not after

Google Analytics is loaded through `@next/third-parties` only once consent is recorded,
and a refusal is stored as a refusal — not as a partial acceptance. The consent state
lives in `src/lib/analytics/`, is covered by tests, and drives the banner rather than the
other way around.

### shadcn/ui rather than a component library

Components are copied into `src/components/ui/` and belong to the project. There is no
version to upgrade, no theme to fight, and no dependency that decides what a button looks
like.

### What is deliberately absent

No authentication, no database, no payment, no error monitoring. Those are architecture
decisions that belong to your project, and shipping them here would hand you dependencies
you did not choose. The starter stops where your decisions begin.

---

## Stack

- **Next.js 16** (App Router) · **React 19.1.2+**, patched for
  [CVE-2025-55182](https://github.com/advisories/GHSA-fv66-9v8q-g76r) (unauthenticated RCE
  in React Server Components, CVSS 10.0)
- **TypeScript 5** · **Tailwind CSS 4** · **shadcn/ui** · light, dark and system themes
- **next-intl** — French and English, default locale unprefixed
- **Hono** on the Node.js runtime for `/api`
- **Vitest** — 43 tests · **ESLint 9** + **Prettier 3** · **pnpm 11**
- **Docker** (Node 22 Alpine and Bun 1.2 images) published to GitHub Container Registry

---

## Getting started

Requires **pnpm** and **Node.js 22** (see `.nvmrc`).

```bash
git clone https://github.com/yg0a1n/nextjs-production-starter.git
cd nextjs-production-starter
cp .env.example .env      # no environment file is versioned
pnpm install && pnpm dev
```

Both variables in `.env.example` are optional — the build falls back to empty values.

---

## Tests

```bash
pnpm test
```

43 tests across 7 files. They cover the places where a silent mistake would be expensive:
locale prefixing (which determines every canonical URL), the JSON-LD graph (which must
never attribute a clone's site to someone else), the consent store, and the API route's
mounting, 404 and CORS behaviour. Utilities are covered too, but they are not the point.

`quality.yml` runs lint, typecheck, tests and build on every pull request and every push
to `main`.

---

## Deployment

Vercel serves the demo; a container image is published to `ghcr.io` on every push to
`main`. Docker usage, the CI/CD workflows in detail, Fly.io setup, and when a paid VM
beats a managed platform are all in **[docs/deployment.md](docs/deployment.md)**.

---

## License

MIT — see [LICENSE](LICENSE).
