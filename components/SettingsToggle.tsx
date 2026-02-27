'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export const SettingsToggle = () => {
  const { theme, language, toggleTheme, toggleLanguage } = useSettings();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="p-2 rounded-full bg-white/30 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-600/30 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors shadow-lg"
        aria-label="Toggle language"
      >
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {language === 'ja' ? 'EN' : 'JP'}
        </span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-white/30 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-600/30 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors shadow-lg"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          // Moon icon for dark mode
          <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          // Sun icon for light mode
          <svg className="w-5 h-5 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};
