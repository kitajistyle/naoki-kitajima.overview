import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kitajistyle.com'),
  title: {
    default: 'Naoki Kitajima | きたじー',
    template: '%s | Naoki Kitajima',
  },
  description: 'Portfolio of Naoki Kitajima (きたじー / KITAJI) — Software Engineer / SRE based in Japan.',
  keywords: ['Naoki Kitajima', 'きたじー', 'KITAJI', 'kitajistyle', 'Software Engineer', 'SRE', 'Bboy'],
  authors: [{ name: 'Naoki Kitajima', url: 'https://github.com/kitajistyle' }],
  creator: 'Naoki Kitajima',
  openGraph: {
    type: 'website',
    siteName: 'Naoki Kitajima | KITAJI',
    title: 'Naoki Kitajima | きたじー',
    description: 'Portfolio of Naoki Kitajima (きたじー / KITAJI) — Software Engineer / SRE based in Japan.',
    images: [{ url: '/icon.jpg', width: 800, height: 800, alt: 'Naoki Kitajima' }],
  },
  twitter: {
    card: 'summary',
    title: 'Naoki Kitajima | きたじー',
    description: 'Portfolio of Naoki Kitajima (きたじー / KITAJI) — Software Engineer / SRE based in Japan.',
    images: ['/icon.jpg'],
    creator: '@kitajistyle',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
