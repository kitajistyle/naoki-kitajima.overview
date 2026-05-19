'use client'

import { Suspense, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { FaGithub, FaXTwitter, FaLinkedin } from 'react-icons/fa6'
import { SiZenn } from 'react-icons/si'

type Phase = 'idle' | 'flying' | 'resetting'
type Pos3  = [number, number, number]

type LinkItem = {
  id: string
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number | string }>
}

const LINKS: LinkItem[] = [
  { id: 'github',   href: 'https://github.com/kitajistyle',    label: 'GitHub',   Icon: FaGithub },
  { id: 'twitter',  href: 'https://x.com/kitajistyle',          label: 'X',        Icon: FaXTwitter },
  { id: 'zenn',     href: 'https://zenn.dev/kitajistyle',        label: 'Zenn',     Icon: SiZenn },
  { id: 'linkedin', href: 'https://linkedin.com/in/kitajistyle', label: 'LinkedIn', Icon: FaLinkedin },
]

// キャンバス上端を突き抜けてアイコン方向へ飛ぶターゲット（各アイコンの x オフセットに対応）
const FLY_TARGET: Record<string, Pos3> = {
  github:   [-1.5, 5.5, 0],
  twitter:  [-0.5, 5.5, 0],
  zenn:     [ 0.5, 5.5, 0],
  linkedin: [ 1.5, 5.5, 0],
}

const FLY_DURATION = 0.82

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
      <meshStandardMaterial color="#f97316" emissive="#fbbf24" emissiveIntensity={2} transparent opacity={0.92} />
    </mesh>
  )
}

// ── Rocket geometry ────────────────────────────────────────────────────────
function RocketGeometry() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 1.8, 24]} />
        <meshStandardMaterial color="#e4e4e7" roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.3, 0.8, 24]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.42, 0.29]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.8} roughness={0.1} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.1, 24]} />
        <meshStandardMaterial color="#71717a" roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.2, 0.32, 0.28, 16]} />
        <meshStandardMaterial color="#52525b" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.72,  0.43]}><boxGeometry args={[0.07, 0.55, 0.44]} /><meshStandardMaterial color="#d4d4d8" roughness={0.4} /></mesh>
      <mesh position={[0, -0.72, -0.43]}><boxGeometry args={[0.07, 0.55, 0.44]} /><meshStandardMaterial color="#a1a1aa" roughness={0.4} /></mesh>
      <mesh position={[ 0.43, -0.72, 0]}><boxGeometry args={[0.44, 0.55, 0.07]} /><meshStandardMaterial color="#d4d4d8" roughness={0.4} /></mesh>
      <mesh position={[-0.43, -0.72, 0]}><boxGeometry args={[0.44, 0.55, 0.07]} /><meshStandardMaterial color="#a1a1aa" roughness={0.4} /></mesh>
    </group>
  )
}

// ── Rocket — cubic ease-in で吸い込み ─────────────────────────────────────
function Rocket({ phase, targetPos }: { phase: Phase; targetPos: Pos3 | null }) {
  const group     = useRef<THREE.Group>(null)
  const progress  = useRef(0)
  const flyStart  = useRef(new THREE.Vector3())
  const target    = useRef(new THREE.Vector3())
  const prevPhase = useRef<Phase>('idle')

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    if (prevPhase.current !== phase) {
      if (phase === 'flying') {
        flyStart.current.copy(g.position)
        progress.current = 0
      }
      if (phase === 'resetting') {
        g.position.set(0, 0, 0)
        g.scale.setScalar(1)
      }
      prevPhase.current = phase
    }

    if (phase === 'idle') {
      const t = state.clock.elapsedTime
      g.position.set(0, Math.sin(t * 0.75) * 0.13, 0)
      g.rotation.y += delta * 0.28
      g.scale.setScalar(1)
    } else if (phase === 'flying' && targetPos) {
      progress.current = Math.min(progress.current + delta / FLY_DURATION, 1)
      const p = progress.current
      const eased = p * p * p
      target.current.set(...targetPos)
      g.position.lerpVectors(flyStart.current, target.current, eased)
      g.scale.setScalar(Math.max(1 - eased, 0.001))
      g.rotation.y += delta * (0.4 + p * p * 18)
    }
  })

  return (
    <group ref={group}>
      <RocketGeometry />
      <Flame />
    </group>
  )
}

function SceneContents({ phase, targetPos }: { phase: Phase; targetPos: Pos3 | null }) {
  return (
    <>
      <color attach="background" args={['#09090b']} />
      <Stars radius={100} depth={60} count={2500} factor={4} fade speed={0.8} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[0, -1.6, 0.8]} color="#f97316" intensity={3} distance={4} decay={2} />
      <Rocket phase={phase} targetPos={targetPos} />
    </>
  )
}

// ── Exported component ────────────────────────────────────────────────────
export function ContactScene({ title }: { title: string }) {
  const [phase, setPhase]         = useState<Phase>('idle')
  const [targetPos, setTargetPos] = useState<Pos3 | null>(null)
  const [activeId, setActiveId]   = useState<string | null>(null)

  const handleIconClick = useCallback(
    (link: LinkItem) => {
      if (phase !== 'idle') return
      window.open(link.href, '_blank', 'noopener,noreferrer')
      setTargetPos(FLY_TARGET[link.id])
      setActiveId(link.id)
      setPhase('flying')
      setTimeout(() => {
        setPhase('resetting')
        setTargetPos(null)
        setTimeout(() => {
          setPhase('idle')
          setActiveId(null)
        }, 80)
      }, Math.round(FLY_DURATION * 1000) + 120)
    },
    [phase],
  )

  return (
    <>
      {/* フルスクリーンキャンバス — ヘッダー下端(top-16)から画面底まで fixed */}
      <div className="fixed top-16 inset-x-0 bottom-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <SceneContents phase={phase} targetPos={targetPos} />
          </Suspense>
        </Canvas>
      </div>

      {/* オーバーレイ — 見出し + アイコン行 */}
      <div className="relative z-10 flex flex-col items-center gap-10 pt-16 sm:pt-24">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wider">{title}</h1>

        <div className="flex items-end gap-10">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleIconClick(link)}
              disabled={phase !== 'idle'}
              aria-label={link.label}
              className={[
                'flex flex-col items-center gap-1.5 transition-all duration-200',
                phase === 'idle' ? 'cursor-pointer hover:text-white hover:scale-110' : 'cursor-default',
                activeId === link.id ? 'text-white scale-125' : 'text-zinc-400',
              ].join(' ')}
            >
              <link.Icon size={40} />
              <span className="text-[10px] font-medium tracking-widest">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
