'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Lenis from 'lenis';
import { UI } from '@/components/UI';

// Dynamic import for Three.js components (client-side only)
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 bg-[#f3f4f6] flex items-center justify-center">
      <div className="text-slate-600">Loading...</div>
    </div>
  ),
});

export default function Home() {
  const [cameraSettings, setCameraSettings] = useState({
    position: [0, 0, 12] as [number, number, number],
    fov: 35,
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial camera settings based on screen size
    const updateCameraSettings = () => {
      const isMobile = window.innerWidth < 768;
      setCameraSettings({
        position: isMobile ? [0, 0, 16] : [0, 0, 12],
        fov: isMobile ? 45 : 35,
      });
    };

    updateCameraSettings();
    window.addEventListener('resize', updateCameraSettings);

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker for performance
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's default lag smoothing to prevent stuttering
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('resize', updateCameraSettings);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      <Scene cameraSettings={cameraSettings} />
      <UI />
    </>
  );
}
