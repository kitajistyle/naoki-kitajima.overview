import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: '#090c1b',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kitajistyle.com'),
  title: {
    default: 'きたじー | KITAJI',
    template: '%s | KITAJI',
  },
  description: 'Portfolio of Kitaji (きたじー / KITAJI) — Software Engineer / SRE based in Japan.',
  keywords: ['Kitaji', 'きたじー', 'KITAJI', 'kitajistyle', 'Software Engineer', 'SRE', 'Bboy'],
  authors: [{ name: 'きたじー', url: 'https://github.com/kitajistyle' }],
  creator: 'きたじー',
  openGraph: {
    type: 'website',
    siteName: 'きたじー | KITAJI',
    title: 'きたじー | KITAJI',
    description: 'Portfolio of Kitaji (きたじー / KITAJI) — Software Engineer / SRE based in Japan.',
    images: [{ url: '/icon.jpg', width: 800, height: 800, alt: 'きたじー' }],
  },
  twitter: {
    card: 'summary',
    title: 'きたじー | KITAJI',
    description: 'Portfolio of Kitaji (きたじー / KITAJI) — Software Engineer / SRE based in Japan.',
    images: ['/icon.jpg'],
    creator: '@kitajistyle',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
