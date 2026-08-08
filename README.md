# Next.js Starter UI kit

## 🚀 What's Included

- **Next.js 16** — exact versions are derived from `package.json` and shown on the [about page](https://starter-nextjs-ui-kit.vercel.app/about), so they cannot go stale here
- **React 19.1.2+** — patched for [CVE-2025-55182](https://github.com/advisories/GHSA-fv66-9v8q-g76r):
  unauthenticated RCE in React Server Components (CVSS 10.0), fixed in 19.0.1 / 19.1.2 / 19.2.1.
  Next.js ships those packages, so both pins matter.
- **TypeScript 5**
- **ESLint 9**
- **Prettier 3**
- **Tailwind CSS 4**
- **Shadcn UI**
- **App Directory**
- **System, Light & Dark Mode**
- **Next.js Bundle Analyzer**
- **Dockerfile** with Node.js 22.16.0 (Alpine)
- **Dockerfile.bun** with Bun 1.2.15 (Alpine)

### 📌 Deliberately pinned versions

Three dependencies are **held back on purpose**. They are not oversights, and Dependabot is
configured to stop proposing their major upgrades until the conditions below are met.

| Package | Held at | Latest | Why |
|---|---|---|---|
| `typescript` | 5.x | 7.0.2 | `typescript-eslint` does not support TS 7 |
| `eslint` | 9.x | 10.8.1 | same toolchain constraint |
| `@types/node` | 22.x | 26.x | must match the Node major actually running (`.nvmrc`) |

**TypeScript 7 / ESLint 10** — upgrading either one stops linting entirely:

```
$ eslint .
typescript-eslint does not support TS 7.0.
```

The failure happens when the module loads, before a single file is analysed. No change in
this repository can work around it — the constraint is upstream. Both pins lift together once
[typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)
ships.

**`@types/node`** — type definitions must describe the runtime you actually execute. `.nvmrc`
and the CI run Node 22; types from Node 26 would describe APIs that do not exist at runtime,
and `tsc` would accept them without a word. This pin lifts when `.nvmrc` moves.

Minor and patch updates keep flowing normally for all three. Only the majors are set aside,
and each `ignore` rule in `.github/dependabot.yml` states the condition for removing it.

### 🛠️ ESLint Plugins

- [**@eslint/js**](https://www.npmjs.com/package/@eslint/js)
- [**typescript-eslint**](https://github.com/typescript-eslint/typescript-eslint)
- [**eslint-plugin-react**](https://github.com/jsx-eslint/eslint-plugin-react)
- [**@next/eslint-plugin-next**](https://github.com/vercel/next.js)
- [**eslint-config-prettier**](eslint-config-prettier)
- [**eslint-plugin-import**](https://github.com/import-js/eslint-plugin-import)
- [**eslint-plugin-promise**](https://github.com/eslint-community/eslint-plugin-promise)

### ✨ Prettier Plugins

- [**@trivago/prettier-plugin-sort-imports**](https://github.com/trivago/prettier-plugin-sort-imports)
- [**prettier-plugin-tailwindcss**](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

## 🏁 Getting Started

### Prerequisites

- **pnpm**: This project uses pnpm as the package manager. You can find installation instructions [here](https://pnpm.io/installation).
- **Node.js**: Version 20.18.0 or higher
- **Docker**: For containerized deployment (optional but recommended)

> **Note**
> This project uses `pnpm` for package management. The `pnpm-lock.yaml` file requires you to use `pnpm` to install dependencies and run scripts to ensure consistency.

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yg0a1n/starter-nextjs-ui-kit.git
    cd starter-nextjs-ui-kit
    ```

2. **Create your environment file** — no environment file is versioned in this repository:
    ```bash
    cp .env.example .env
    ```

3. **Install Dependencies**:
    ```bash
    pnpm install
    ```

4. **Run Development Server**:
    ```bash
    pnpm dev
    ```

5. **Build for Production**:
    ```bash
    pnpm build
    ```

> **Note**
> ⚠️ This project was developed and tested primarily on macOS (Mac Pro). Some commands or configurations may require adjustments on other systems (Linux, Windows).

###  Docker Setup

**Development and production use different images, on purpose.**

The dev container (`.devcontainer/`) runs a **pre-built image from Microsoft** — the
recommended approach for development: it ships the toolchain, keeps sources mounted, and
rebuilds on change. `Dockerfile` and `Dockerfile.bun` do the opposite: they produce a
**minimal, immutable production artifact** — multi-stage build, standalone output,
non-root user, no dev dependencies. They are optimized for shipping, not for coding, and
are unsuitable for day-to-day development.

Keeping the two apart is what lets the production image stay small and reproducible while
the development environment stays comfortable.

To use Docker, make sure Docker is installed on your machine. Then, build and run the Docker container:

> **Note**
> If you modify your .env file, you must re-run the above export command in your terminal to update the environment variables for your current session.

```bash
export $(grep -v '^#' .env | xargs)

docker build --progress=plain $(grep -v '^#' .env | xargs -I{} echo --build-arg {}) -t starter-nextjs-ui-kit -f Dockerfile .

# or if using Bun

docker build $(grep -v '^#' .env | xargs -I{} echo --build-arg {}) -t starter-nextjs-ui-kit -f Dockerfile.bun .

docker run -p 3000:3000 starter-nextjs-ui-kit
```

###  Docker Cleanup

If you need to remove the Docker container and image, you can use the following commands.

First, find the container ID:

```bash
docker ps -a --filter "ancestor=starter-nextjs-ui-kit"
```

Then, stop and remove the container using its ID:

```bash
docker rm <container_id>
```

Finally, remove the Docker image:

```bash
docker rmi starter-nextjs-ui-kit
```

### 🚀 CI/CD

Two workflows, with **different trigger modes** — the distinction matters.

#### `quality.yml` — automatic

Runs on **every pull request and every push to `main`**: install, lint, typecheck, build.
This is the workflow that gates changes, and it needs no configuration to work.

It is triggered by `pull_request` — never `pull_request_target`, which would expose
repository secrets and a write token to code coming from a fork.

#### `docker-publish.yml` — automatic, and **no secret required**

Runs on **every push to `main`** (and on demand from the Actions tab). It builds the image
from `Dockerfile.bun` and publishes it to **GitHub Container Registry** with two tags:
`latest` and the Git commit SHA.

```
ghcr.io/<owner>/<repo>:latest
ghcr.io/<owner>/<repo>:<sha>
```

**Nothing to configure.** `ghcr.io` authenticates with `GITHUB_TOKEN`, which GitHub Actions
mints at the start of every job — ephemeral, scoped to this repository, never stored in your
secrets. That is why this workflow can run on push: no credential can be missing.

Publishing requires elevating that token, which is declared **in the workflow file itself**,
at job level:

```yaml
permissions:
  contents: read # re-declared: `permissions` replaces the default set
  packages: write # lets this job — and only this job — publish
```

The repository setting stays on `read`; no other workflow is affected.

The published image appears under the repository's **Packages** tab after the first
successful run. The registry matches the `[registry]` block in `fly.toml`.

This workflow **does not deploy**: the `flyctl deploy` step is commented out and production
is served by Vercel. It publishes an image, nothing more.

**GitHub Actions: Variables Setup**

No secret is needed. Only these build-time variables, and both are optional — the build
falls back to empty values:

**Settings > Secrets and variables > Actions > Variables > Repository variables**
- `NEXT_PUBLIC_APP_URL`: The public URL of your app (e.g., `https://your-app.fly.dev`)
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: Your Google Analytics ID (e.g., `G-XXXXXXX`)

Add `FLY_API_TOKEN` as a repository **secret** only if you uncomment the Fly.io deploy step.

Once everything is set, choose your cloud host. For Fly.io, follow the steps below:

### Fly.io App Setup & Check

1. Log in to Fly.io using the Fly CLI:
   ```bash
   fly auth login
   ```
2. **Create the app** (if it already exists, Fly.io will show a non-blocking error):
   ```bash
   fly apps create starter-nextjs-ui-kit
   ```
3. **List all apps to verify presence:**
   ```bash
   fly apps list
   ```

Once your app is ready, pushing to `main` builds and publishes the image to `ghcr.io`
automatically. You can also trigger `docker-publish.yml` by hand from the **Actions** tab.

Deploying that image to Fly.io is a separate step: the `flyctl deploy` block in the workflow
is commented out, so nothing reaches Fly.io automatically. Uncomment it — and set
`FLY_API_TOKEN` — if you want the workflow to deploy as well.

- After deployment, visit your app via the Fly.io dashboard or directly at your assigned Fly.io URL.

### 🚀 Deploying on Vercel

Deploying this project on [Vercel](https://vercel.com/) is super easy and free for most use cases:

1. Create an account on [vercel.com](https://vercel.com/).
2. Click "New Project" and connect your GitHub repo.
3. Keep the default settings (Next.js is auto-detected).
4. Click "Deploy". That's it!

#### ⚡️ Vercel vs Paid VM

- **Free visual hosting**:
  For personal projects, portfolios, MVPs, side-projects, for testing, showcasing, iterating.
  You get a public domain, preview URLs, SSL, analytics, etc. for free. You only pay if you exceed the generous free limits, and everything is managed (build, CDN, SSL, preview, rollback, logs...)
- **Paid VM**: 
  You have to manage everything (domain, SSL, monitoring, backups, security, scaling, etc.) and pay every month, even if your project gets no traffic. Only useful if you have specific needs (custom infra, heavy backend, root access, etc.)

> **In short:**
> For 99% of projects, start on Vercel. Switch to a paid VM only if you need something Vercel can't do or if you want full control over the infrastructure.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

> **Note: Who is this Docker architecture (Next.js + Hono in one image) for?**
>
> **🧑‍💻 Fullstack Indie/Freelance Dev**
> One image to build, deploy, monitor → simplicity and speed
>
> **🏢 Small product team / startup**
> Less infra, unified deployment, cost-efficient
>
> **🧪 Beta project / proof of concept**
> Fast deployment, no multi-service complexity
>
> **🛠️ Minimalist DevOps**
> One image = one service → less orchestration
>
> **🌐 Multi-tenant apps or PWA without heavy backend**
> Hono handles lightweight API + Next handles frontend = fast, smooth combo
>
> **🚀 Edge-ready projects but not 100% CDN-compatible**
> Need cookies/session or server-side auth
>
> **📦 In summary:**
> This architecture is for those who want a smart monolith:
> - Develop fast
> - Deploy simply
> - Control the whole cycle (from routing to headers)

Once your Docker image is built, you can deploy it to any cloud provider (VPS, VM, or container service) of your choice for easy and portable production hosting.
