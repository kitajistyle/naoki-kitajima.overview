'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

function DigitalBook() {
  const groupRef = useRef<THREE.Group>(null)
  
  // Particles state (x, y, z, speed, angleOffset, radius, scale)
  const particleCount = 18
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      speed: 0.8 + Math.random() * 0.7,
      radius: 0.1 + Math.random() * 0.45,
      angleOffset: (i / particleCount) * Math.PI * 2,
      yOffset: Math.random() * 3, // Initial heights
      scale: 0.02 + Math.random() * 0.035,
    }))
  }, [])

  const satRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Slow bobbing and rotation for the book
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.28
      groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.1
      groupRef.current.position.y = -0.2 + Math.sin(t * 0.65) * 0.15
    }

    // Particle motion (spiraling upwards)
    particles.forEach((p, i) => {
      const mesh = satRefs.current[i]
      if (!mesh) return

      // Progressively increment Y
      let newY = p.yOffset + t * p.speed
      newY = (newY % 4.2) - 1.2 // Wrap around between y = -1.2 to 3.0

      // Spiral motion relative to center
      const angle = t * 2.8 + p.angleOffset
      const rad = p.radius * (1.0 + (newY + 1.2) * 0.25) // Spread wider as it rises

      mesh.position.set(rad * Math.cos(angle), newY, rad * Math.sin(angle))
      
      // Fade out near the top
      const opacity = Math.max(0, 1 - (newY - 1.5) / 1.5)
      if (mesh.material) {
        (mesh.material as THREE.MeshStandardMaterial).opacity = opacity * 0.7
      }
    })
  })

  return (
    <group ref={groupRef} position={[2.4, -0.2, -2.5]} scale={1.15}>
      {/* 3D Digital Book */}
      <group rotation={[0.2, 0, 0.1]}>
        {/* Left page - Solid base */}
        <mesh position={[-0.58, 0, 0]} rotation={[0, -Math.PI / 10, 0]}>
          <boxGeometry args={[1.1, 1.5, 0.015]} />
          <meshStandardMaterial
            color="#0ea5e9"
            transparent
            opacity={0.16}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {/* Left page - Wireframe */}
        <mesh position={[-0.58, 0, 0]} rotation={[0, -Math.PI / 10, 0]}>
          <boxGeometry args={[1.1, 1.5, 0.015]} />
          <meshStandardMaterial
            color="#0ea5e9"
            wireframe
            transparent
            opacity={0.22}
            emissive="#0ea5e9"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Right page - Solid base */}
        <mesh position={[0.58, 0, 0]} rotation={[0, Math.PI / 10, 0]}>
          <boxGeometry args={[1.1, 1.5, 0.015]} />
          <meshStandardMaterial
            color="#2dd4bf"
            transparent
            opacity={0.16}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {/* Right page - Wireframe */}
        <mesh position={[0.58, 0, 0]} rotation={[0, Math.PI / 10, 0]}>
          <boxGeometry args={[1.1, 1.5, 0.015]} />
          <meshStandardMaterial
            color="#2dd4bf"
            wireframe
            transparent
            opacity={0.22}
            emissive="#2dd4bf"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Spine/Center - Solid */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[0.08, 1.55, 0.03]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* Rise Particles (representing data/knowledge streams) */}
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => { satRefs.current[i] = el }}
          scale={p.scale}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#38bdf8' : '#2dd4bf'}
            emissive={i % 2 === 0 ? '#0ea5e9' : '#0d9488'}
            emissiveIntensity={1.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

export function BlogScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#090c1b']} />
          <Stars radius={100} depth={60} count={1100} factor={2.6} fade speed={1.0} />
          
          <ambientLight intensity={0.22} />
          <directionalLight position={[4, 5, 3]} intensity={0.5} />
          
          {/* Light glowing source near the book */}
          <pointLight position={[2.4, -0.2, -2.5]} color="#2dd4bf" intensity={2.2} distance={8} decay={1.5} />
          <pointLight position={[4.0, 1.5, -2.0]} color="#0ea5e9" intensity={1.5} distance={10} decay={1.5} />

          <DigitalBook />
        </Suspense>
      </Canvas>
    </div>
  )
}
