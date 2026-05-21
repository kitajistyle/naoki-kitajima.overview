'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

function OrbitalRings() {
  const sphereRef  = useRef<THREE.Mesh>(null)
  const ring1Ref   = useRef<THREE.Mesh>(null)
  const ring2Ref   = useRef<THREE.Mesh>(null)
  const ring3Ref   = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.07
      sphereRef.current.rotation.x += delta * 0.018
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.13
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.09
    if (ring3Ref.current) ring3Ref.current.rotation.x += delta * 0.07
  })

  return (
    <group position={[2.6, -0.2, -2]}>
      {/* Core wireframe sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.6, 18, 18]} />
        <meshStandardMaterial
          color="#1e3a5f"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Equatorial orbit */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.013, 6, 80]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.4}
          emissive="#38bdf8"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Tilted orbit */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <torusGeometry args={[2.75, 0.01, 6, 80]} />
        <meshStandardMaterial
          color="#818cf8"
          transparent
          opacity={0.28}
          emissive="#818cf8"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Outer slow orbit */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 3]}>
        <torusGeometry args={[3.2, 0.008, 6, 80]} />
        <meshStandardMaterial
          color="#34d399"
          transparent
          opacity={0.2}
          emissive="#34d399"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

export function AboutScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#090c1b']} />
          <Stars radius={100} depth={60} count={1000} factor={2.5} fade speed={0.4} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <OrbitalRings />
        </Suspense>
      </Canvas>
    </div>
  )
}
