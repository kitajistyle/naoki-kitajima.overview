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
    'hero.catchphrase': 'コードで信頼を、\nダンスで個性を。',
    'hero.tagline': 'SRE × フルスタック × クリエイティビティ',
    'hero.scroll': 'スクロールして読む',

    // About
    'about.title': 'About',
    'about.role': 'Payment Infrastructure SRE / フルスタックエンジニア',
    'about.description': 'メガベンチャーにて決済基盤のSRE（Site Reliability Engineering）を担当。システムの信頼性向上やインフラ構築に加え、フロントエンドからバックエンドまで一気通貫で開発が可能。',
    'about.name': 'きたじー（KITAJI）',

    // Skills
    'skills.title': 'Skills',
    'skills.hint': 'スクロールでページをめくってね',
    'skills.sre': '⚙️ SRE / Infra',
    'skills.dev': '💻 Development',

    // Hobbies
    'hobbies.title': 'Lifestyle',
    'hobbies.coffee.title': '☕ こだわりのコーヒー',
    'hobbies.coffee.desc': 'コーヒー豆の産地・焙煎にこだわり、毎朝一杯を丁寧に淹れる。器具も道具も自分でセレクト。',
    'hobbies.dance.title': '💃 ダンス',
    'hobbies.dance.desc': 'ストリートダンスを嗜む。エンジニアとしての論理思考とリズム感覚を融合させた、もう一つの自己表現。',

    // Contact
    'contact.title': 'Contact',
    'contact.message': 'お気軽にお声がけください 👋',
    'contact.backToTop': 'トップに戻る',

    // SEO
    'seo.h1': '北島直樹（きたじー/KITAJI）- フルスタックエンジニア・SRE ポートフォリオ',
  },
  en: {
    // Hero
    'hero.catchphrase': 'Reliability in Code,\nCreativity in Motion.',
    'hero.tagline': 'SRE × Full-Stack × Creativity',
    'hero.scroll': 'Scroll to explore',

    // About
    'about.title': 'About',
    'about.role': 'Payment Infrastructure SRE / Full-Stack Engineer',
    'about.description': 'SRE at a mega-venture, managing payment infrastructure. Capable of full-stack development from frontend to backend, as well as infrastructure and reliability engineering.',
    'about.name': 'KITAJI',

    // Skills
    'skills.title': 'Skills',
    'skills.hint': 'Scroll to turn pages',
    'skills.sre': '⚙️ SRE / Infra',
    'skills.dev': '💻 Development',

    // Hobbies
    'hobbies.title': 'Lifestyle',
    'hobbies.coffee.title': '☕ Specialty Coffee',
    'hobbies.coffee.desc': 'Passionate about coffee origins and roasting profiles. Carefully brewing a cup each morning with hand-selected equipment.',
    'hobbies.dance.title': '💃 Dance',
    'hobbies.dance.desc': 'Street dancer blending logical thinking with rhythm and expression. Another side of creativity beyond code.',

    // Contact
    'contact.title': 'Contact',
    'contact.message': 'Feel free to reach out 👋',
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
