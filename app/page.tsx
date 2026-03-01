'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Lenis from 'lenis';
import { UI } from '@/components/UI';
import { ContactSection } from '@/components/UI';
import { SettingsToggle } from '@/components/SettingsToggle';

// Three.js Scene は Hero の背景として固定表示（SSRなし）
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 bg-[#f3f4f6] dark:bg-[#1a1a2e]" />
  ),
});

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lenis スムーススクロールの初期化
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      {/* 設定トグル（ライト/ダーク・言語） */}
      <SettingsToggle />

      {/* Three.js 3Dブック: Hero の背景として固定表示 */}
      <Scene cameraSettings={{ position: [0, 0, 12], fov: 35 }} />

      {/* HTML メインコンテンツ（通常スクロールページ） */}
      <UI />

      {/* Contact アイコン: pointer-events-none の外に独立配置 */}
      <ContactSection />
    </>
  );
}
