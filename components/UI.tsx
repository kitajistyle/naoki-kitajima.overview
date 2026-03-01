'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── TOC items ─────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { label: 'Hero', ratio: 0.0 },
  { label: 'About', ratio: 0.48 },
  { label: 'Skills', ratio: 0.68 },
  { label: 'Lifestyle', ratio: 0.80 },
  { label: 'Contact', ratio: 0.94 },
];


// ─── Contact links ──────────────────────────────────────────────────────────
const CONTACT_LINKS = [
  {
    label: 'X',
    href: 'https://x.com/kitajistyIe',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/kitajistyle',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/kitajistyle',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Qiita',
    href: 'https://qiita.com/kitajistyle',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.902.74c-2.938 0-5.5 1.017-7.686 3.052C2.03 5.826.937 8.4.937 11.419c0 3.018 1.063 5.593 3.188 7.625C6.25 21.074 8.814 22.091 11.9 22.091c1.875 0 3.594-.422 5.156-1.266 1.563-.843 2.797-2.015 3.703-3.515h-3.14c-.72.937-1.595 1.656-2.626 2.156-1.031.5-2.14.75-3.328.75-2.22 0-4.11-.782-5.672-2.344-1.562-1.562-2.344-3.484-2.344-5.766 0-2.28.782-4.218 2.344-5.812C7.554 4.7 9.448 3.9 11.668 3.9c1.657 0 3.11.44 4.36 1.32 1.25.88 2.172 2.11 2.766 3.69H12.34v2.484h9.234V8.33a10.614 10.614 0 00-.938-2.953 10.22 10.22 0 00-1.937-2.578c-1.032-.969-2.204-1.71-3.516-2.22A11.084 11.084 0 0011.903.74z" />
      </svg>
    ),
  },
];

// ─── Contact Section ────────────────────────────────────────────────────────
export const ContactSection = () => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setShown(progress >= 0.91);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed z-[100] transition-all duration-700 ease-out
        bottom-6 left-1/2 -translate-x-1/2
        md:bottom-auto md:left-auto md:translate-x-0 md:right-6 md:top-1/2 md:-translate-y-1/2
        ${shown
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
    >
      {/* モバイル: 横並び / デスクトップ: 縦並び */}
      <div className="flex flex-row gap-4 md:flex-col md:gap-8">
        {CONTACT_LINKS.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex items-center justify-center
              w-10 h-10 md:w-12 md:h-12
              rounded-full
              bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
              border border-slate-200 dark:border-slate-700
              text-slate-600 dark:text-slate-300
              hover:text-amber-600 dark:hover:text-amber-400
              hover:border-amber-400 hover:scale-110
              transition-all duration-200 shadow-sm"
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  );
};

// ─── Table of Contents ─────────────────────────────────────────────────────
const TableOfContents = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useSettings();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, pointerEvents: 'none' });

    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: '5% top',
      end: '98% top',
      onEnter: () => gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power2.out', pointerEvents: 'auto' }),
      onLeave: () => gsap.to(el, { opacity: 0, duration: 0.4, pointerEvents: 'none' }),
      onEnterBack: () => gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power2.out', pointerEvents: 'auto' }),
      onLeaveBack: () => gsap.to(el, { opacity: 0, duration: 0.4, pointerEvents: 'none' }),
    });

    const updateActive = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      let current = 0;
      TOC_ITEMS.forEach((item, i) => {
        if (progress >= item.ratio - 0.05) current = i;
      });
      setActiveIndex(current);
    };
    window.addEventListener('scroll', updateActive, { passive: true });

    return () => {
      trigger.kill();
      window.removeEventListener('scroll', updateActive);
    };
  }, []);

  const handleClick = (ratio: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * ratio, behavior: 'smooth' });
  };

  return (
    <div
      ref={ref}
      className={`fixed z-50
        bottom-20 left-1/2 -translate-x-1/2
        md:bottom-auto md:left-auto md:translate-x-0 md:right-6 md:top-1/2 md:-translate-y-1/2`}
    >
      {/* モバイル: ドットのみ横並び */}
      <div className="flex flex-row gap-5 md:hidden">
        {TOC_ITEMS.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item.ratio)}
              aria-label={item.label}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${isActive
                  ? 'bg-blue-500 border-blue-500 scale-125'
                  : 'bg-white/70 dark:bg-slate-900/70 border-slate-400 dark:border-slate-500'
                  }`}
              />
            </button>
          );
        })}
      </div>

      {/* デスクトップ: ドット＋ラベルの縦リスト */}
      <div className="hidden md:block">
        <p className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-3 uppercase">
          {t('toc.label')}
        </p>
        <div className="relative flex flex-col gap-0">
          <div className="absolute left-[5px] top-3 bottom-3 w-[1px] bg-slate-300 dark:bg-slate-600" />
          {TOC_ITEMS.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={item.label}
                onClick={() => handleClick(item.ratio)}
                className="relative flex items-center gap-3 py-2 text-left cursor-pointer group"
              >
                <span
                  className={`relative z-10 flex-shrink-0 w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 ${isActive
                    ? 'bg-blue-500 border-blue-500 scale-110'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                    }`}
                />
                <span
                  className={`text-[13px] transition-all duration-300 whitespace-nowrap ${isActive
                    ? 'font-bold text-slate-800 dark:text-slate-100'
                    : 'font-normal text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Scroll Hint ───────────────────────────────────────────────────────
const ScrollHint = () => {
  const { t } = useSettings();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2
        transition-all duration-700
        ${visible ? 'opacity-100 translate-y-0 pointer-events-none' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
        {t('hero.scroll')}
      </span>
      {/* 矢印（バウンスアニメーション） */}
      <svg
        className="w-5 h-5 text-slate-400 dark:text-slate-500 animate-bounce"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────
export const UI = () => {
  const { t } = useSettings();

  return (
    <div className="relative w-full z-10 pointer-events-none">
      <h1 className="sr-only">{t('seo.h1')}</h1>
      <div className="pointer-events-auto">
        <ScrollHint />
        <TableOfContents />
      </div>
      {/* ブックアニメーション全体が再生できるスクロール領域 */}
      <div className="h-[800vh]" />
    </div>
  );
};
