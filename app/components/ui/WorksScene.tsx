'use client'

import { Suspense, useRef, useMemo } from 'react'
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
      m.position.y = item.pos[1] + Math.sin(clock.elapsedTime * 0.45 + item.phase) * 0.2
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
            opacity={0.13}
            emissive={item.color}
            emissiveIntensity={0.45}
          />
        </mesh>
      ))}
    </>
  )
}

export function WorksScene() {
  const items = useMemo<ShapeItem[]>(() => [
    { pos: [-4.6,  1.5, -4], rot: [0.3, 0.5, 0],   spd: [0.10, 0.15, 0.05], scale: 1.4, color: '#38bdf8', geo: 'octahedron', phase: 0.0 },
    { pos: [ 4.3, -1.0, -5], rot: [0.1, 0.2, 0.4],  spd: [0.08, 0.12, 0.07], scale: 1.7, color: '#818cf8', geo: 'box',        phase: 1.2 },
    { pos: [-2.5, -2.8, -3], rot: [0.5, 0.0, 0.2],  spd: [0.12, 0.08, 0.10], scale: 1.0, color: '#34d399', geo: 'octahedron', phase: 2.4 },
    { pos: [ 3.8,  2.8, -6], rot: [0.0, 0.3, 0.1],  spd: [0.07, 0.11, 0.09], scale: 2.0, color: '#f472b6', geo: 'octahedron', phase: 0.7 },
    { pos: [-0.5,  3.3, -7], rot: [0.2, 0.4, 0.3],  spd: [0.09, 0.06, 0.13], scale: 1.2, color: '#fb923c', geo: 'box',        phase: 1.8 },
    { pos: [-3.6,  0.2, -6], rot: [0.4, 0.1, 0.5],  spd: [0.11, 0.09, 0.08], scale: 1.5, color: '#a3e635', geo: 'box',        phase: 3.1 },
    { pos: [ 1.8,  0.5, -3], rot: [0.2, 0.3, 0.1],  spd: [0.06, 0.14, 0.07], scale: 0.9, color: '#e879f9', geo: 'octahedron', phase: 4.2 },
  ], [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#090c1b']} />
          <Stars radius={100} depth={50} count={900} factor={2.5} fade speed={0.35} />
          <ambientLight intensity={0.4} />
          <FloatingShapes items={items} />
        </Suspense>
      </Canvas>
    </div>
  )
}
