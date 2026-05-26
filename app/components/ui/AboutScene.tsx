'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

function OrbitalRings() {
  const sphereOuterRef = useRef<THREE.Mesh>(null)
  const sphereInnerRef = useRef<THREE.Mesh>(null)
  
  const ring1Ref = useRef<THREE.Group>(null)
  const ring2Ref = useRef<THREE.Group>(null)
  const ring3Ref = useRef<THREE.Group>(null)
  const ring4Ref = useRef<THREE.Group>(null)
  const ring5Ref = useRef<THREE.Group>(null)

  const sat1Ref = useRef<THREE.Mesh>(null)
  const sat2Ref = useRef<THREE.Mesh>(null)
  const sat3Ref = useRef<THREE.Mesh>(null)
  const sat4Ref = useRef<THREE.Mesh>(null)
  const sat5Ref = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // 1. Core Sphere animations
    if (sphereOuterRef.current) {
      sphereOuterRef.current.rotation.y += delta * 0.25
      sphereOuterRef.current.rotation.x += delta * 0.08
    }
    if (sphereInnerRef.current) {
      sphereInnerRef.current.rotation.y -= delta * 0.15
      // Pulsing effect
      const pulse = 1.0 + Math.sin(t * 3.5) * 0.08
      sphereInnerRef.current.scale.setScalar(pulse)
    }

    // 2. Ring self-rotation and satellite orbit animations
    // Orbit 1: Magenta (r=1.9, speed=2.2)
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.45
    if (sat1Ref.current) {
      const angle = t * 2.2
      sat1Ref.current.position.set(1.9 * Math.cos(angle), 1.9 * Math.sin(angle), 0)
    }

    // Orbit 2: Cyan (r=2.4, speed=-1.8)
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.35
    if (sat2Ref.current) {
      const angle = t * -1.8
      sat2Ref.current.position.set(2.4 * Math.cos(angle), 2.4 * Math.sin(angle), 0)
    }

    // Orbit 3: Gold (r=2.9, speed=1.4)
    if (ring3Ref.current) ring3Ref.current.rotation.x += delta * 0.3
    if (sat3Ref.current) {
      const angle = t * 1.4
      sat3Ref.current.position.set(2.9 * Math.cos(angle), 0, 2.9 * Math.sin(angle))
    }

    // Orbit 4: Violet (r=3.4, speed=-1.1)
    if (ring4Ref.current) ring4Ref.current.rotation.y -= delta * 0.25
    if (sat4Ref.current) {
      const angle = t * -1.1
      sat4Ref.current.position.set(0, 3.4 * Math.cos(angle), 3.4 * Math.sin(angle))
    }

    // Orbit 5: Emerald (r=3.9, speed=0.8)
    if (ring5Ref.current) ring5Ref.current.rotation.z += delta * 0.22
    if (sat5Ref.current) {
      const angle = t * 0.8
      sat5Ref.current.position.set(3.9 * Math.cos(angle), 3.9 * Math.sin(angle), 0)
    }
  })

  return (
    <group position={[2.6, -0.2, -2]}>
      {/* 1. Core Sphere - Outer Wireframe */}
      <mesh ref={sphereOuterRef}>
        <sphereGeometry args={[1.2, 20, 20]} />
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.22}
          emissive="#2563eb"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* 1. Core Sphere - Inner Solid Glowing Core */}
      <mesh ref={sphereInnerRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#818cf8"
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 2. Orbit 1: Magenta */}
      <group ref={ring1Ref} rotation={[Math.PI / 2.2, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[1.9, 0.018, 6, 80]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#f43f5e"
            emissiveIntensity={0.45}
            transparent
            opacity={0.32}
          />
        </mesh>
        <mesh ref={sat1Ref}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#fda4af" emissive="#f43f5e" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* 2. Orbit 2: Cyan */}
      <group ref={ring2Ref} rotation={[Math.PI / 4, -0.3, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[2.4, 0.015, 6, 80]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={0.4}
            transparent
            opacity={0.28}
          />
        </mesh>
        <mesh ref={sat2Ref}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#0ea5e9" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* 2. Orbit 3: Gold */}
      <group ref={ring3Ref} rotation={[-Math.PI / 5, 0.4, -Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[2.9, 0.013, 6, 80]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#eab308"
            emissiveIntensity={0.35}
            transparent
            opacity={0.24}
          />
        </mesh>
        <mesh ref={sat3Ref}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#fef9c3" emissive="#eab308" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* 2. Orbit 4: Violet */}
      <group ref={ring4Ref} rotation={[Math.PI / 3, 0.5, Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[3.4, 0.011, 6, 80]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
          />
        </mesh>
        <mesh ref={sat4Ref}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#f3e8ff" emissive="#a855f7" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* 2. Orbit 5: Emerald */}
      <group ref={ring5Ref} rotation={[-Math.PI / 3, -0.2, Math.PI / 8]}>
        <mesh>
          <torusGeometry args={[3.9, 0.009, 6, 80]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.25}
            transparent
            opacity={0.16}
          />
        </mesh>
        <mesh ref={sat5Ref}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#d1fae5" emissive="#10b981" emissiveIntensity={1.8} />
        </mesh>
      </group>
    </group>
  )
}

export function AboutScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#090c1b']} />
          <Stars radius={100} depth={60} count={1200} factor={2.8} fade speed={1.2} />
          
          <ambientLight intensity={0.25} />
          <directionalLight position={[5, 5, 5]} intensity={0.55} />
          
          {/* Dynamic point lights for glowing effect */}
          <pointLight position={[2.6, -0.2, -2]} color="#6366f1" intensity={3.0} distance={10} decay={1.5} />
          <pointLight position={[6, 3, -1]} color="#f43f5e" intensity={1.8} distance={12} decay={1.5} />
          <pointLight position={[-1, -4, -3]} color="#0ea5e9" intensity={1.3} distance={10} decay={1.5} />

          <OrbitalRings />
        </Suspense>
      </Canvas>
    </div>
  )
}
