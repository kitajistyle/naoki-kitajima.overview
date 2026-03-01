import type { Metadata } from 'next';
import './globals.css';
import { SettingsProvider } from '@/contexts/SettingsContext';

export const metadata: Metadata = {
  title: '北島直樹 (きたじー/KITAJI) | フルスタックエンジニア・SRE',
  description: '北島直樹（きたじー）のポートフォリオサイト。メガベンチャーにて決済基盤のSREを担当するフルスタックソフトウェアエンジニア。Kubernetes、Go、TypeScript、Reactなどを用いてフロントエンドからバックエンドまで一気通貫で開発。',
  keywords: [
    '北島直樹',
    'きたじー',
    'KITAJI',
    'フルスタックエンジニア',
    'ソフトウェアエンジニア',
    'SRE',
    'Site Reliability Engineer',
    '決済基盤',
    'Kubernetes',
    'Go',
    'TypeScript',
    'React',
    'GCP',
    'Terraform',
  ],
  authors: [{ name: '北島直樹', url: 'https://kitajistyle.com' }],
  creator: '北島直樹',
  publisher: '北島直樹',
  openGraph: {
    title: '北島直樹 (きたじー) | フルスタックエンジニア・SRE',
    description: '北島直樹（きたじー）のポートフォリオ。決済基盤SRE・フルスタックエンジニアとして活動中。',
    url: 'https://kitajistyle.com',
    siteName: '北島直樹 Portfolio',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '北島直樹 (きたじー) | フルスタックエンジニア',
    description: '決済基盤SRE・フルスタックエンジニア 北島直樹のポートフォリオ',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://kitajistyle.com',
  },
  verification: {
    // Google Search Consoleで発行された「HTMLタグ」のcontentの値を設定
    google: 'your-verification-code',
  },
};

// 構造化データ (JSON-LD)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: '北島直樹',
  alternateName: ['きたじー', 'KITAJI', 'Naoki Kitajima'],
  url: 'https://kitajistyle.com',
  jobTitle: 'フルスタックソフトウェアエンジニア',
  worksFor: {
    '@type': 'Organization',
    name: 'メガベンチャー',
  },
  knowsAbout: [
    'Site Reliability Engineering',
    'Kubernetes',
    'Go',
    'TypeScript',
    'React',
    'GCP',
    'Terraform',
    '決済システム',
  ],
  sameAs: [
    'https://github.com/kitajistyle',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
