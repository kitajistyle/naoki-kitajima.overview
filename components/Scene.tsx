'use client';

import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import { useSettings } from '@/contexts/SettingsContext';

interface SceneProps {
  cameraSettings: {
    position: [number, number, number];
    fov: number;
  };
}

export default function Scene({ cameraSettings }: SceneProps) {
  const { theme } = useSettings();

  return (
    <div className={`fixed inset-0 z-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-[#f3f4f6]'}`}>
      <Canvas
        shadows
        camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}
