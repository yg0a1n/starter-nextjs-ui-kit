import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // `standalone` sert aux IMAGES DOCKER (fournies par ce starter). Sur Vercel il est inutile — la
  // plateforme fabrique sa propre sortie — et NUISIBLE : pour assembler `.next/standalone`, Next lit
  // les traces `.nft.json` ; le builder Vercel fait son propre traçage et ne les produit pas, d'où
  // `ENOENT .next/next-server.js.nft.json` pendant `next build` (combo nouveau Next 16 + Turbopack).
  // On exprime la cible : standalone hors Vercel (Docker), sortie par défaut sur Vercel.
  output: process.env.VERCEL ? undefined : 'standalone',
  devIndicators: false,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  // Ensure static files are served correctly
  async headers() {
    return [
      {
        source: '/og-image.png',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
