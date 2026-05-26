'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function VinylDisc() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 3.0
    }
  })

  const grooveRadii = Array.from({ length: 14 }, (_, i) => 0.75 + i * 0.105)

  return (
    <group ref={groupRef} rotation={[-0.35, 0, 0]}>
      {/* Main disc */}
      <mesh>
        <cylinderGeometry args={[2.2, 2.2, 0.09, 80]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.12} metalness={0.75} />
      </mesh>

      {/* Shiny rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.045, 8, 80]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.08} metalness={0.92} />
      </mesh>

      {/* Grooves — top face */}
      {grooveRadii.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.048, 0]}>
          <torusGeometry args={[r, 0.007, 4, 100]} />
          <meshStandardMaterial color="#191919" roughness={0.04} metalness={0.96} />
        </mesh>
      ))}

      {/* Center label */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.02, 40]} />
        <meshStandardMaterial
          color="#be123c"
          roughness={0.55}
          metalness={0.05}
          emissive="#9f1239"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Label decoration ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.062, 0]}>
        <torusGeometry args={[0.44, 0.009, 6, 40]} />
        <meshStandardMaterial color="#fda4af" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Center spindle hole */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.16, 20]} />
        <meshStandardMaterial color="#090c1b" />
      </mesh>
    </group>
  )
}

export function VinylScene() {
  return (
    <div className="w-full h-56 sm:h-72">
      <Canvas
        camera={{ position: [0, 3.8, 4.2], fov: 42 }}
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 5]} intensity={2.2} />
          <pointLight position={[-3, 2, 3]} color="#f43f5e" intensity={3.5} distance={9} decay={2} />
          <pointLight position={[3, 1, 2]}  color="#818cf8" intensity={1.8} distance={7} decay={2} />
          <VinylDisc />
        </Suspense>
      </Canvas>
    </div>
  )
}
