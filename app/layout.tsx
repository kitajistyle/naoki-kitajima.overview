import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import ThreeBackgroundWrapper from "./components/ThreeBackgroundWrapper";
import JsonLd from "./components/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "北島直樹 (Naoki Kitajima) - Portfolio",
    template: "%s | 北島直樹 (Naoki Kitajima)",
  },
  description: "エンジニア 北島直樹 (Naoki Kitajima / きたじまなおき) のポートフォリオ。ユーザー目線で課題解決ができるエンジニアを目指し、Next.jsを用いたWeb開発やハッカソンでの個人開発に取り組んでいます。圧倒的な行動力で『なぜ実装するのか』を追求した制作実績をご覧ください。",
  keywords: [
    "北島直樹", "きたじまなおき", "Naoki Kitajima",
    "エンジニア", "Web開発", "プログラミング", "Next.js", "個人開発", // Big Words
    "ユーザー目線", "課題解決", "ハッカソン", "行動力", "フロントエンド", "バックエンド" // Long Tail
  ],
  authors: [{ name: "Naoki Kitajima" }],
  creator: "Naoki Kitajima",
  metadataBase: new URL("https://naoki-kitajima.com"), // TODO: Replace with actual domain
  openGraph: {
    title: "北島直樹 (Naoki Kitajima) - Portfolio",
    description: "エンジニア 北島直樹のポートフォリオ。制作実績や活動記録をご覧いただけます。",
    url: "https://naoki-kitajima.com", // TODO: Replace with actual domain
    siteName: "Naoki Kitajima Portfolio",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "北島直樹 (Naoki Kitajima) - Portfolio",
    description: "エンジニア 北島直樹のポートフォリオ。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white`}>
        <JsonLd />
        <ThreeBackgroundWrapper />
        <Header />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
