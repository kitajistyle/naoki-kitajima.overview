'use client';

import React, { useEffect, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Section wrapper ───────────────────────────────────────────────────────
const Section = ({
  className,
  children,
  align = 'center',
  compact = false,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  compact?: boolean;
  id?: string;
}) => {
  let alignClass = 'justify-center items-center text-center px-4';
  if (align === 'left') alignClass = 'justify-center md:justify-start items-center px-4 md:pl-12 text-center md:text-left';
  if (align === 'right') alignClass = 'justify-center md:justify-end items-center px-4 md:pr-12 text-center md:text-right';

  return (
    <section
      id={id}
      className={`h-screen w-full flex ${alignClass} pointer-events-none relative ${className}`}
    >
      <div
        className={`pointer-events-auto bg-white/20 dark:bg-slate-800/30 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/10 dark:border-slate-600/20 ${compact ? 'max-w-[200px] md:max-w-xs' : 'max-w-[280px] md:max-w-sm'
          }`}
      >
        {children}
      </div>
    </section>
  );
};

// ─── Skill badge ───────────────────────────────────────────────────────────
const SkillTag = ({ skill }: { skill: string }) => (
  <span className="px-2 py-1 bg-slate-800/70 dark:bg-slate-600/70 text-white text-xs rounded-full">
    {skill}
  </span>
);

// ─── TOC ──────────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { label: 'About', href: '#about', emoji: '👤' },
  { label: 'Skills', href: '#skills', emoji: '⚡' },
  { label: 'Hobbies', href: '#hobbies', emoji: '🎨' },
  { label: 'Contact', href: '#contact', emoji: '✉️' },
];

const TableOfContents = () => {
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tocRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 20, pointerEvents: 'none' });

    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: '15% top',
      end: '97% top',
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', pointerEvents: 'auto' }),
      onLeave: () => gsap.to(el, { opacity: 0, y: 20, duration: 0.4, pointerEvents: 'none' }),
      onEnterBack: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', pointerEvents: 'auto' }),
      onLeaveBack: () => gsap.to(el, { opacity: 0, y: 20, duration: 0.4, pointerEvents: 'none' }),
    });

    return () => trigger.kill();
  }, []);

  const scrollTo = (href: string) => {
    const sectionMap: Record<string, number> = {
      '#about': 0.36,
      '#skills': 0.52,
      '#hobbies': 0.78,
      '#contact': 0.95,
    };
    const ratio = sectionMap[href] ?? 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * ratio, behavior: 'smooth' });
  };

  return (
    <div
      ref={tocRef}
      className={[
        'fixed z-20',
        'bottom-6 left-1/2 -translate-x-1/2',
        'md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-6 md:left-auto md:translate-x-0',
      ].join(' ')}
    >
      {/* mobile: horizontal */}
      <div className="flex md:hidden flex-row gap-3 bg-white/20 dark:bg-slate-800/40 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg border border-white/20 dark:border-slate-600/20">
        {TOC_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => scrollTo(item.href)}
            className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* desktop: vertical */}
      <div className="hidden md:flex flex-col gap-2 bg-white/20 dark:bg-slate-800/40 backdrop-blur-sm px-4 py-4 rounded-2xl shadow-lg border border-white/20 dark:border-slate-600/20">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase mb-1 text-center">Menu</p>
        {TOC_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => scrollTo(item.href)}
            className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-left cursor-pointer"
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Hero section ─────────────────────────────────────────────────────────
const HeroSection = () => {
  const { t } = useSettings();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    // フェードアウト while scrolling
    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: '3% top',
      end: '10% top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(el, { opacity: 1 - self.progress, y: -self.progress * 30 });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      id="hero"
      className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none"
    >
      <div ref={heroRef} className="text-center px-6">
        {/* Name badge */}
        <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-amber-700 dark:text-amber-400 font-medium mb-4 animate-fade-in-up">
          KITAJI / きたじー
        </p>

        {/* Main catchphrase */}
        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-4 whitespace-pre-line animate-fade-in-up"
          style={{ animationDelay: '0.1s', fontFamily: 'Playfair Display, serif' }}
        >
          {t('hero.catchphrase')}
        </h1>

        {/* Tagline */}
        <p
          className="text-sm md:text-base text-slate-600 dark:text-slate-400 tracking-wide mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          {t('hero.tagline')}
        </p>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-xs text-slate-500 dark:text-slate-500 tracking-widest uppercase">
            {t('hero.scroll')}
          </p>
          <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-500 mt-1 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

// ─── Hobby card ────────────────────────────────────────────────────────────
const HobbyCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="hobby-card rounded-lg p-3 border border-white/20 dark:border-slate-600/30 bg-white/10 dark:bg-slate-700/20 transition-all duration-300 hover:bg-white/25 dark:hover:bg-slate-700/40">
    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

// ─── Main UI ───────────────────────────────────────────────────────────────
export const UI = () => {
  const { t } = useSettings();

  return (
    <div className="relative w-full z-10">
      {/* SEO: Hidden but crawlable */}
      <h1 className="sr-only">{t('seo.h1')}</h1>

      {/* HERO: fixed overlay at top */}
      <HeroSection />

      {/* TOC */}
      <TableOfContents />

      {/* SPACER: Book pops out and opens (0–35%) */}
      <div className="h-[200vh]" />

      {/* ── ABOUT (35–50%) ─────────────────────────────────────────────── */}
      <Section id="about" align="right" className="h-[150vh]" compact>
        <p className="text-[10px] tracking-widest uppercase text-amber-700 dark:text-amber-400 font-semibold mb-1">
          {t('about.name')}
        </p>
        <h2 className="text-lg md:text-xl text-slate-800 dark:text-slate-100 font-bold mb-1">
          {t('about.title')}
        </h2>
        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-2">
          {t('about.role')}
        </p>
        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {t('about.description')}
        </p>
      </Section>

      {/* ── SKILLS (50–75%): sticky panel ──────────────────────────────── */}
      <div id="skills" className="h-[400vh] w-full relative pointer-events-none">
        <div className="sticky top-4 left-4 md:top-8 md:left-12 max-w-[200px] md:max-w-[240px] pointer-events-auto p-3 rounded-lg bg-white/20 dark:bg-slate-800/30 backdrop-blur-sm shadow-lg border border-white/10 dark:border-slate-600/20">
          <h2 className="text-lg text-slate-800 dark:text-slate-100 font-bold mb-1">
            {t('skills.title')}
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3">
            {t('skills.hint')}
          </p>

          {/* SRE / Infra */}
          <div className="mb-3">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1.5">
              {t('skills.sre')}
            </p>
            <div className="flex flex-wrap gap-1">
              <SkillTag skill="Kubernetes" />
              <SkillTag skill="Terraform" />
              <SkillTag skill="GCP" />
              <SkillTag skill="Prometheus" />
              <SkillTag skill="ArgoCD" />
              <SkillTag skill="Datadog" />
            </div>
          </div>

          {/* Development */}
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1.5">
              {t('skills.dev')}
            </p>
            <div className="flex flex-wrap gap-1">
              <SkillTag skill="Go" />
              <SkillTag skill="TypeScript" />
              <SkillTag skill="React" />
              <SkillTag skill="Next.js" />
              <SkillTag skill="PostgreSQL" />
              <SkillTag skill="Docker" />
            </div>
          </div>
        </div>
      </div>

      {/* ── HOBBIES (75–85%) ───────────────────────────────────────────── */}
      <Section id="hobbies" align="right" className="h-[120vh]">
        <h2 className="text-lg md:text-xl text-slate-800 dark:text-slate-100 font-bold mb-3">
          {t('hobbies.title')}
        </h2>
        <div className="space-y-2">
          <HobbyCard title={t('hobbies.coffee.title')} desc={t('hobbies.coffee.desc')} />
          <HobbyCard title={t('hobbies.dance.title')} desc={t('hobbies.dance.desc')} />
        </div>
      </Section>

      {/* ── CONTACT (90–100%) ──────────────────────────────────────────── */}
      <Section id="contact" className="h-screen" compact>
        <h2 className="text-xl md:text-2xl text-slate-800 dark:text-slate-100 font-bold mb-1">
          {t('contact.title')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          {t('contact.message')}
        </p>

        <div className="flex flex-col gap-2">
          {/* GitHub */}
          <a
            href="https://github.com/kitajistyle"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-800 dark:bg-slate-600 text-white rounded-full hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors pointer-events-auto text-xs inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/kitajistyle"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-black dark:bg-slate-700 text-white rounded-full hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors pointer-events-auto text-xs inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X (Twitter)
          </a>
        </div>

        <button
          className="mt-5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors pointer-events-auto text-xs underline cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {t('contact.backToTop')}
        </button>
      </Section>
    </div>
  );
};
