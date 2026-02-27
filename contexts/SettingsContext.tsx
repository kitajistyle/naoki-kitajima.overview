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
    // About
    'about.title': 'About',
    'about.role': 'Payment Infrastructure SRE',
    'about.description': 'メガベンチャーにて決済基盤のSREを担当。\nフロントからバックエンドまで\n一気通貫で開発可能。',

    // Skills
    'skills.title': 'Skills',
    'skills.hint': 'スクロールでページをめくってね',
    'skills.sre': 'SRE',
    'skills.dev': 'Dev',

    // Contact
    'contact.title': 'Contact',
    'contact.backToTop': 'トップに戻る',

    // SEO
    'seo.h1': '北島直樹（きたじー/KITAJI）- フルスタックエンジニア・SRE ポートフォリオ',
  },
  en: {
    // About
    'about.title': 'About',
    'about.role': 'Payment Infrastructure SRE',
    'about.description': 'SRE at a mega-venture, managing payment infrastructure.\nFull-stack development from frontend to backend.',

    // Skills
    'skills.title': 'Skills',
    'skills.hint': 'Scroll to turn pages',
    'skills.sre': 'SRE',
    'skills.dev': 'Dev',

    // Contact
    'contact.title': 'Contact',
    'contact.backToTop': 'Back to Top',

    // SEO
    'seo.h1': 'Naoki Kitajima (KITAJI) - Full-Stack Engineer & SRE Portfolio',
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ja');
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
      // Detect browser language
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
