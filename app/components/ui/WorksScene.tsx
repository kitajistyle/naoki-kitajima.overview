'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

type ShapeItem = {
  pos: [number, number, number]
  rot: [number, number, number]
  spd: [number, number, number]
  scale: number
  color: string
  geo: 'box' | 'octahedron'
  phase: number
}

function FloatingShapes({ items }: { items: ShapeItem[] }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }, delta) => {
    items.forEach((item, i) => {
      const m = refs.current[i]
      if (!m) return
      m.rotation.x += item.spd[0] * delta
      m.rotation.y += item.spd[1] * delta
      m.rotation.z += item.spd[2] * delta
      m.position.y = item.pos[1] + Math.sin(clock.elapsedTime * 1.2 + item.phase) * 0.2
    })
  })

  return (
    <>
      {items.map((item, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el }}
          position={item.pos}
          rotation={item.rot}
          scale={item.scale}
        >
          {item.geo === 'box'
            ? <boxGeometry args={[1, 1, 1]} />
            : <octahedronGeometry args={[0.7]} />}
          <meshStandardMaterial
            color={item.color}
            wireframe
            transparent
            opacity={0.42}
            emissive={item.color}
            emissiveIntensity={0.75}
          />
        </mesh>
      ))}
    </>
  )
}

const ITEMS: ShapeItem[] = [
  { pos: [-4.6,  1.5, -4], rot: [0.3, 0.5, 0],   spd: [0.30, 0.45, 0.15], scale: 1.4, color: '#38bdf8', geo: 'octahedron', phase: 0.0 },
  { pos: [ 4.3, -1.0, -5], rot: [0.1, 0.2, 0.4],  spd: [0.24, 0.36, 0.21], scale: 1.7, color: '#818cf8', geo: 'box',        phase: 1.2 },
  { pos: [-2.5, -2.8, -3], rot: [0.5, 0.0, 0.2],  spd: [0.36, 0.24, 0.30], scale: 1.0, color: '#34d399', geo: 'octahedron', phase: 2.4 },
  { pos: [ 3.8,  2.8, -6], rot: [0.0, 0.3, 0.1],  spd: [0.21, 0.33, 0.27], scale: 2.0, color: '#f472b6', geo: 'octahedron', phase: 0.7 },
  { pos: [-0.5,  3.3, -7], rot: [0.2, 0.4, 0.3],  spd: [0.27, 0.18, 0.39], scale: 1.2, color: '#fb923c', geo: 'box',        phase: 1.8 },
  { pos: [-3.6,  0.2, -6], rot: [0.4, 0.1, 0.5],  spd: [0.33, 0.27, 0.24], scale: 1.5, color: '#a3e635', geo: 'box',        phase: 3.1 },
  { pos: [ 1.8,  0.5, -3], rot: [0.2, 0.3, 0.1],  spd: [0.18, 0.42, 0.21], scale: 0.9, color: '#e879f9', geo: 'octahedron', phase: 4.2 },
]

export function WorksScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#090c1b']} />
          <Stars radius={100} depth={50} count={900} factor={2.5} fade speed={1.05} />
          <ambientLight intensity={0.4} />
          <FloatingShapes items={ITEMS} />
        </Suspense>
      </Canvas>
    </div>
  )
}
