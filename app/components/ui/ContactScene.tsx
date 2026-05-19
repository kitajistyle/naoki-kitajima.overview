'use client'

import { Suspense, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { FaGithub, FaXTwitter, FaLinkedin } from 'react-icons/fa6'
import { SiZenn } from 'react-icons/si'

type Phase = 'idle' | 'flying' | 'resetting'
type Pos3 = [number, number, number]

type LinkItem = {
  id: string
  pos: Pos3
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number | string }>
}

const ORBIT = 2.3

const LINKS: LinkItem[] = [
  { id: 'github',   pos: [0, ORBIT, 0],    href: 'https://github.com/kitajistyle',    label: 'GitHub',   Icon: FaGithub },
  { id: 'twitter',  pos: [ORBIT, 0, 0],    href: 'https://x.com/kitajistyle',          label: 'X',        Icon: FaXTwitter },
  { id: 'zenn',     pos: [0, -ORBIT, 0],   href: 'https://zenn.dev/kitajistyle',        label: 'Zenn',     Icon: SiZenn },
  { id: 'linkedin', pos: [-ORBIT, 0, 0],   href: 'https://linkedin.com/in/kitajistyle', label: 'LinkedIn', Icon: FaLinkedin },
]

// ── Exhaust flame ──────────────────────────────────────────────────────────
function Flame() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    mesh.current.scale.y = 0.85 + Math.sin(t * 14) * 0.15
    ;(mesh.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      1.6 + Math.sin(t * 11) * 0.4
  })
  return (
    <mesh ref={mesh} position={[0, -1.3, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.14, 0.55, 8]} />
      <meshStandardMaterial
        color="#f97316"
        emissive="#fbbf24"
        emissiveIntensity={2}
        transparent
        opacity={0.92}
      />
    </mesh>
  )
}

// ── Rocket geometry ────────────────────────────────────────────────────────
function RocketGeometry() {
  return (
    <group>
      {/* Main body */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 1.8, 24]} />
        <meshStandardMaterial color="#e4e4e7" roughness={0.35} metalness={0.15} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.3, 0.8, 24]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Porthole window */}
      <mesh position={[0, 0.42, 0.29]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>
      {/* Accent stripe */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.1, 24]} />
        <meshStandardMaterial color="#71717a" roughness={0.4} />
      </mesh>
      {/* Nozzle */}
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.2, 0.32, 0.28, 16]} />
        <meshStandardMaterial color="#52525b" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Fins — front & back */}
      <mesh position={[0, -0.72, 0.43]}>
        <boxGeometry args={[0.07, 0.55, 0.44]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.72, -0.43]}>
        <boxGeometry args={[0.07, 0.55, 0.44]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.4} />
      </mesh>
      {/* Fins — left & right */}
      <mesh position={[0.43, -0.72, 0]}>
        <boxGeometry args={[0.44, 0.55, 0.07]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.4} />
      </mesh>
      <mesh position={[-0.43, -0.72, 0]}>
        <boxGeometry args={[0.44, 0.55, 0.07]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.4} />
      </mesh>
    </group>
  )
}

// ── Animated rocket (position / scale driven by phase) ─────────────────────
function Rocket({ phase, targetPos }: { phase: Phase; targetPos: Pos3 | null }) {
  const group = useRef<THREE.Group>(null)
  const vec = useRef(new THREE.Vector3())
  const scl = useRef(new THREE.Vector3(1, 1, 1))

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime

    if (phase === 'idle') {
      // gentle float + slow spin
      g.position.set(0, Math.sin(t * 0.75) * 0.13, 0)
      g.rotation.y += delta * 0.28
      g.scale.setScalar(1)
    } else if (phase === 'flying' && targetPos) {
      // lerp toward icon position and shrink
      vec.current.set(...targetPos)
      scl.current.setScalar(0.06)
      const k = Math.min(delta * 5, 0.18)
      g.position.lerp(vec.current, k)
      g.scale.lerp(scl.current, k)
    } else if (phase === 'resetting') {
      // snap back instantly (rocket is already tiny/near icon)
      g.position.set(0, 0, 0)
      g.scale.setScalar(1)
    }
  })

  return (
    <group ref={group}>
      <RocketGeometry />
      <Flame />
    </group>
  )
}

// ── Full scene contents ────────────────────────────────────────────────────
function SceneContents({
  phase,
  targetPos,
  onIconClick,
}: {
  phase: Phase
  targetPos: Pos3 | null
  onIconClick: (link: LinkItem) => void
}) {
  return (
    <>
      {/* Dark space background */}
      <color attach="background" args={['#09090b']} />
      <Stars radius={100} depth={60} count={2500} factor={4} fade speed={0.8} />

      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      {/* Exhaust glow */}
      <pointLight position={[0, -1.6, 0.8]} color="#f97316" intensity={3} distance={4} decay={2} />

      <Rocket phase={phase} targetPos={targetPos} />

      {/* Social icons as HTML overlays in 3D space */}
      {LINKS.map((link) => (
        <Html key={link.id} position={link.pos} center>
          <button
            onClick={() => onIconClick(link)}
            className="group flex flex-col items-center gap-1.5 text-white cursor-pointer"
            aria-label={link.label}
          >
            <span className="drop-shadow-lg group-hover:text-zinc-300 transition-colors duration-200">
              <link.Icon size={40} />
            </span>
            <span className="text-[10px] font-medium tracking-widest text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200">
              {link.label}
            </span>
          </button>
        </Html>
      ))}
    </>
  )
}

// ── Exported component ────────────────────────────────────────────────────
export function ContactScene() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [targetPos, setTargetPos] = useState<Pos3 | null>(null)

  const handleIconClick = useCallback(
    (link: LinkItem) => {
      if (phase !== 'idle') return
      // Open link immediately (avoids popup blocker — direct click event)
      window.open(link.href, '_blank', 'noopener,noreferrer')
      setTargetPos([...link.pos] as Pos3)
      setPhase('flying')
      setTimeout(() => {
        setPhase('resetting')
        setTargetPos(null)
        setTimeout(() => setPhase('idle'), 80)
      }, 900)
    },
    [phase],
  )

  return (
    <div className="w-full max-w-lg h-[520px] rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <SceneContents phase={phase} targetPos={targetPos} onIconClick={handleIconClick} />
        </Suspense>
      </Canvas>
    </div>
  )
}
