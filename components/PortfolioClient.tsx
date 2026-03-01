'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Lenis from 'lenis';
import { UI, ContactSection } from '@/components/UI';
import { SettingsToggle } from '@/components/SettingsToggle';

const Scene = dynamic(
  () => import(/* webpackPreload: true */ '@/components/Scene'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 flex items-center justify-center bg-[#f3f4f6] dark:bg-[#1a1a2e]">
        <span className="text-4xl font-bold tracking-widest text-[#5D4037] animate-pulse select-none">
          KITAJI
        </span>
      </div>
    ),
  }
);

export function PortfolioClient() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Store the callback reference so we can remove it in cleanup
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return (
    <>
      <SettingsToggle />
      <Scene cameraSettings={{ position: [0, 0, 12], fov: 35 }} />
      <UI />
      <ContactSection />
    </>
  );
}
