import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import ThreeLayout from "./components/ThreeLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naoki Portfolio",
  description: "Naoki Portfolio site",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white`}>
        <ThreeLayout />
        <Header />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
