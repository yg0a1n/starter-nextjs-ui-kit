FROM node:26.6.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# pnpm est installe explicitement, PAS via corepack : corepack a ete retire des
# images Node recentes (`corepack enable` sort en exit 127 sur node:26-alpine).
# La version est celle du champ `packageManager` de package.json — les deux
# doivent rester alignees.
RUN npm install -g pnpm@11.20.0

# Copy dependency files
# pnpm-workspace.yaml est INDISPENSABLE : il porte `overrides` et `allowBuilds`.
# Le lockfile est genere avec ces reglages ; sans le fichier, pnpm ne les voit
# pas et `--frozen-lockfile` echoue en ERR_PNPM_LOCKFILE_CONFIG_MISMATCH.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies with cache
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm in the builder stage as well
RUN npm install -g pnpm@11.20.0

# Declare ARGs for all environment variables
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

# Convert ARGs to ENVs
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build with cache
RUN --mount=type=cache,target=/app/.next/cache \
    pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static files
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy build files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
