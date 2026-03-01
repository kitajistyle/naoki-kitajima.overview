'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'ja' | 'en';

interface SettingsContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  ja: {
    // Hero
    'hero.scroll': 'スクロールして読む',

    // SEO
    'seo.h1': '北島直樹（きたじー/KITAJI）- フルスタックエンジニア・SRE ポートフォリオ',

    // UI
    'toc.label': '目次',

    // ── Book pages ──────────────────────────────────────────────
    // Hero page
    'book.hero.label': 'HERO',
    'book.hero.name': 'KITAJI',
    'book.hero.fullname': '北島直樹（きたじー）',
    'book.hero.role': '決済基盤 SRE\n＆ フルスタックエンジニア',
    'book.hero.tagline': 'SRE  ×  フルスタック  × クリエイティブ',
    'book.hero.location': '東京 / 日本  ·  2026',

    // About/Career page
    'book.about.title': 'About',
    'book.career.edu.date': '2022.04',
    'book.career.edu.name': '東京理科大学',
    'book.career.edu.dept': '理学部 — 物理学専攻',
    'book.career.taian.date': '2024.07 – 2025.03',
    'book.career.taian.name': 'TAIAN Inc.',
    'book.career.taian.role': 'フロントエンドエンジニア — BFF & UI',
    'book.career.zozo.date': '2025.07 – 2026.03',
    'book.career.zozo.name': 'ZOZO Inc.',
    'book.career.zozo.role': 'バックエンドエンジニア — マイクロサービス',
    'book.career.tripx.date': '2025.07 – 現在',
    'book.career.tripx.name': 'TripX / EasyX',
    'book.career.tripx.role': 'フルスタック — AI プロダクト',
    'book.career.summary': '4社 · 2022年〜現在',

    // Skills pages
    'book.skills.title': 'Skills',
    'book.skills.dev.section': 'Development',

    // Lifestyle page
    'book.lifestyle.title': 'Lifestyle',
    'book.lifestyle.coffee.title': '☕コーヒー',
    'book.lifestyle.coffee.desc': 'コーヒーが大好きで、大学時代はバリスタをしていました。',
    'book.lifestyle.dance.title': '🕺ダンス',
    'book.lifestyle.dance.desc': 'ヒップホップが好きで、bboyとして活動しています。',

    // Contact page
    'book.contact.title': 'Contact',
    'book.contact.message': 'お気軽にどうぞ！',
    'book.contact.hint': '↓ 下のアイコンをクリック ↓',
    'book.contact.x': 'X (Twitter)',
    'book.contact.github': 'GitHub',
    'book.contact.linkedin': 'LinkedIn',
    'book.contact.qiita': 'Qiita',
  },
  en: {
    // Hero
    'hero.scroll': 'Scroll to explore',

    // SEO
    'seo.h1': 'Naoki Kitajima (KITAJI) - Full-Stack Engineer & SRE Portfolio',

    // UI
    'toc.label': 'Contents',

    // ── Book pages ──────────────────────────────────────────────
    // Hero page
    'book.hero.label': 'HERO',
    'book.hero.name': 'KITAJI',
    'book.hero.fullname': 'Naoki Kitajima',
    'book.hero.role': 'Payment Infra SRE\n& Full-Stack Developer',
    'book.hero.tagline': 'SRE  ×  Full-Stack  ×  Creativity',
    'book.hero.location': 'Tokyo / Japan  ·  2026',

    // About/Career page
    'book.about.title': 'About',
    'book.career.edu.date': '2022.04',
    'book.career.edu.name': 'Tokyo University of Science',
    'book.career.edu.dept': 'B.S. — Physics',
    'book.career.taian.date': '2024.07 – 2025.03',
    'book.career.taian.name': 'TAIAN Inc.',
    'book.career.taian.role': 'Frontend Engineer — BFF & UI',
    'book.career.zozo.date': '2025.07 – 2026.03',
    'book.career.zozo.name': 'ZOZO Inc.',
    'book.career.zozo.role': 'Backend Eng. — Microservices',
    'book.career.tripx.date': '2025.07 – Present',
    'book.career.tripx.name': 'TripX / EasyX',
    'book.career.tripx.role': 'Full-Stack — AI Products',
    'book.career.summary': '4 experiences  ·  2022–present',

    // Skills pages
    'book.skills.title': 'Skills',
    'book.skills.dev.section': 'Development',

    // Lifestyle page
    'book.lifestyle.title': 'Lifestyle',
    'book.lifestyle.coffee.title': '☕  Coffee',
    'book.lifestyle.coffee.desc': 'I worked as a barista during college.',
    'book.lifestyle.dance.title': '🕺  Dance',
    'book.lifestyle.dance.desc': 'I love hip-hop and am active as a bboy.',

    // Contact page
    'book.contact.title': 'Contact',
    'book.contact.message': 'Feel free to reach out!',
    'book.contact.hint': '↓ Click the icons below ↓',
    'book.contact.x': 'X (Twitter)',
    'book.contact.github': 'GitHub',
    'book.contact.linkedin': 'LinkedIn',
    'book.contact.qiita': 'Qiita',
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Default to English; switch to Japanese only if browser is explicitly Japanese
      const browserLang = navigator.language.startsWith('ja') ? 'ja' : 'en';
      setLanguage(browserLang);
    }
  }, []);


  useEffect(() => {
    if (!mounted) return;

    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ja' ? 'en' : 'ja');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ja']] || key;
  };

  return (
    <SettingsContext.Provider value={{ theme, language, toggleTheme, toggleLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
