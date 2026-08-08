import { routing } from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(en|fr)/:path*',

    // Enable redirects that add missing locales
    // Match only internationalized pathnames.
    //
    // Everything served at a fixed root path must be excluded here, otherwise the middleware
    // treats it as a page to localize and answers 404 — even though the route exists and the
    // build generates it. `llms.txt` was in that case.
    '/((?!_next|_vercel|api|sitemap.xml|robots.txt|llms.txt|favicon.ico|og-image.png|apple-touch-icon.png|img|icons|logo).*)'
  ]
};
