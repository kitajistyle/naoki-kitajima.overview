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
  description: "エンジニア 北島直樹 (Naoki Kitajima) のポートフォリオサイトです。Web開発、フロントエンド、バックエンドのスキルや制作実績（Works）、活動記録（Active）を掲載しています。",
  keywords: ["北島直樹", "Naoki Kitajima", "エンジニア", "ポートフォリオ", "Web開発", "フロントエンド", "バックエンド", "Next.js"],
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
