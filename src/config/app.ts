// App

export const DEFAULT_BASE_URL = 'http://localhost:3000';
export const COPYRIGHT_FULL_YEAR = 2026;

// Author

export const AUTHOR_NAME = 'yg0a1n';
export const COMPANY_NAME = 'Flexiweb Evo';
export const AUTHOR_WEBSITE_URL = 'https://www.flexiweb-evo.eu/';
export const GITHUB_REPO_NAME = 'starter-nextjs-ui-kit';
export const GITHUB_REPO = `${AUTHOR_NAME}/${GITHUB_REPO_NAME}`;
export const SOURCE_CODE_URL = `https://github.com/${GITHUB_REPO}`;

// Theme

export const THEME_OPTIONS = ['light', 'dark', 'system'] as const;
export const DEFAULT_THEME = THEME_OPTIONS[2];

// Social

export const CONTACT_EMAIL = 'y.goalen@outlook.com';
export const EMAIL_URL = `mailto:${CONTACT_EMAIL}`;
export const GITHUB_URL = SOURCE_CODE_URL;
export const LINKEDIN_URL = 'https://www.linkedin.com/in/y-goalen/';
export const TWITTERX_URL = 'https://x.com/htttpcode';
export const BSKY_URL = 'https://bsky.app/profile/yg0a1n.bsky.social';
export const TELEGRAM_URL = 'https://t.me/yg0a1n';

// Consents

export const COOKIE_CONSENT_LOCAL_STORAGE_KEY = 'cookie_consent';
export const CONSENT_MODE_LOCAL_STORAGE_KEY = 'ga_consent_mode';
export const FIRST_VISIT_LOCAL_STORAGE_KEY_TEMPORARY = 'first_visit';

export const consentsDefault = {
  necessary: true,
  analytics: false,
  preferences: false,
  marketing: false
};

export const consentsAcceptAll = {
  necessary: true,
  analytics: true,
  preferences: true,
  marketing: true
};

// Logger

export const LOG_DIR = 'log';
