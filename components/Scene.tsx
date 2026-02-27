'use client';

import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';

interface SceneProps {
  cameraSettings: {
    position: [number, number, number];
    fov: number;
  };
}

export default function Scene({ cameraSettings }: SceneProps) {
  return (
    <div className="fixed inset-0 z-0 bg-[#f3f4f6]">
      <Canvas
        shadows
        camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}
