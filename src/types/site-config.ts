export type AuthorsConfig = {
  name: string;
  url: string;
};
export type ThemeColor = {
  media: string;
  color: string;
};
export type SiteConfig = {
  name: string;
  tagLine: string;
  title: string;
  description: string;
  url: string;
  authors: AuthorsConfig[];
  keywords: string[];
  altOgImage: string;
  socialLinks: {
    github: string;
    bluesky: string;
    twitterx: string;
    email: string;
    linkedin: string;
    telegram: string;
  };
  creator: string;
  themeColors?: string | ThemeColor[];
  defaultNextTheme?: string;
  icons: {
    icon: string;
    shortcut?: string;
    apple?: string;
  };
};
