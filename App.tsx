import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Lenis from 'lenis';

import { Experience } from './components/Experience';
import { UI } from './components/UI';
import { PasswordGate } from './components/PasswordGate';

function App() {
  const [cameraSettings, setCameraSettings] = React.useState({
    position: [0, 0, 12] as [number, number, number],
    fov: 35
  });

  useEffect(() => {
    // Set initial camera settings based on screen size
    const updateCameraSettings = () => {
      const isMobile = window.innerWidth < 768;
      setCameraSettings({
        position: isMobile ? [0, 0, 16] : [0, 0, 12],
        fov: isMobile ? 45 : 35
      });
    };

    updateCameraSettings();
    window.addEventListener('resize', updateCameraSettings);

    return () => {
      window.removeEventListener('resize', updateCameraSettings);
    };
  }, []);

  useEffect(() => {
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
      // Cleanup
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <PasswordGate>
      <div className="fixed inset-0 z-0 bg-[#f3f4f6]">
        <Canvas shadows camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}>
          <Experience />
        </Canvas>
      </div>

      <UI />
    </PasswordGate>
  );
}

export default App;