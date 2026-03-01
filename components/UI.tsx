'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── TOC items ─────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { label: 'Hero', ratio: 0.0 },
  { label: 'About', ratio: 0.37 },
  { label: 'Skills', ratio: 0.52 },
  { label: 'Lifestyle', ratio: 0.78 },
];

// ─── Table of Contents ─────────────────────────────────────────────────────
const TableOfContents = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // フェードイン（スクロール開始後）
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, x: -16, pointerEvents: 'none' });

    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: '5% top',
      end: '98% top',
      onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', pointerEvents: 'auto' }),
      onLeave: () => gsap.to(el, { opacity: 0, x: -16, duration: 0.4, pointerEvents: 'none' }),
      onEnterBack: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', pointerEvents: 'auto' }),
      onLeaveBack: () => gsap.to(el, { opacity: 0, x: -16, duration: 0.4, pointerEvents: 'none' }),
    });

    // スクロール位置に応じてアクティブ項目を更新
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
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
    >
      {/* ヘッダー */}
      <p className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-3 uppercase">
        目次
      </p>

      {/* 縦ライン＋アイテム */}
      <div className="relative flex flex-col gap-0">
        {/* 縦の線 */}
        <div className="absolute left-[5px] top-3 bottom-3 w-[1px] bg-slate-300 dark:bg-slate-600" />

        {TOC_ITEMS.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item.ratio)}
              className="relative flex items-center gap-3 py-2 text-left cursor-pointer group"
            >
              {/* ドット */}
              <span
                className={`relative z-10 flex-shrink-0 w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 ${isActive
                    ? 'bg-blue-500 border-blue-500 scale-110'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                  }`}
              />
              {/* ラベル */}
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
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────
export const UI = () => {
  const { t } = useSettings();

  return (
    <div className="relative w-full z-10 pointer-events-none">
      <h1 className="sr-only">{t('seo.h1')}</h1>
      <div className="pointer-events-auto">
        <TableOfContents />
      </div>
    </div>
  );
};
