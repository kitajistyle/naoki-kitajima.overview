import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KITAJI | Full-Stack Software Engineer',
  description: '止まらない決済基盤を支え、価値を形にするフルスタックエンジニア。メガベンチャーにて決済基盤のSREを担当。フロントエンドからバックエンドまで一気通貫で開発可能。',
  keywords: ['Software Engineer', 'SRE', 'Full-Stack', 'Kubernetes', 'Go', 'TypeScript', 'React'],
  authors: [{ name: 'KITAJI' }],
  openGraph: {
    title: 'KITAJI | Full-Stack Software Engineer',
    description: '止まらない決済基盤を支え、価値を形にするフルスタックエンジニア',
    url: 'https://kitaji.dev',
    siteName: 'KITAJI Portfolio',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KITAJI | Full-Stack Software Engineer',
    description: '止まらない決済基盤を支え、価値を形にするフルスタックエンジニア',
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </head>
      <body>{children}</body>
    </html>
  );
}
