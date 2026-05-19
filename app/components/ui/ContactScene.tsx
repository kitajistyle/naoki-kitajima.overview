'use client'

import { Suspense, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, RoundedBox, Text } from '@react-three/drei'
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

const FLY_DURATION = 0.85

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
        g.position.set(0, -2.5, 0)
        g.scale.setScalar(1)
      }
      prevPhase.current = phase
    }

    if (phase === 'idle') {
      const t = state.clock.elapsedTime
      g.position.set(0, Math.sin(t * 0.75) * 0.13 - 2.5, 0)
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
    <group ref={group} position={[0, -2.5, 0]}>
      <group scale={0.55}>
        <RocketGeometry />
        <Flame />
      </group>
    </group>
  )
}

// ── 3D icon card — Html/Float を使わず純粋な 3D メッシュのみ ──────────────
function Icon3D({
  link,
  pos,
  isActive,
  disabled,
  onIconClick,
}: {
  link: LinkItem
  pos: Pos3
  isActive: boolean
  disabled: boolean
  onIconClick: (link: LinkItem) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    // 各カードで位相をずらした bob アニメーション
    groupRef.current.position.y =
      pos[1] + Math.sin(clock.elapsedTime * 1.4 + pos[0]) * 0.055
  })

  return (
    <group ref={groupRef} position={pos}>
      <RoundedBox
        args={[0.58, 0.58, 0.13]}
        radius={0.09}
        smoothness={4}
        onClick={() => { if (!disabled) onIconClick(link) }}
        onPointerEnter={() => {
          if (!disabled) { document.body.style.cursor = 'pointer'; setHovered(true) }
        }}
        onPointerLeave={() => { document.body.style.cursor = 'auto'; setHovered(false) }}
      >
        <meshStandardMaterial
          color={hovered ? '#1e1e40' : '#111128'}
          roughness={0.22}
          metalness={0.85}
          emissive={isActive ? '#3355ff' : hovered ? '#1a2288' : '#080818'}
          emissiveIntensity={isActive ? 2.8 : hovered ? 0.7 : 0.2}
        />
      </RoundedBox>
      {/* 純粋な 3D テキスト — DOM 要素なのでクリックを奪わない */}
      <Text
        position={[0, 0, 0.075]}
        fontSize={0.1}
        color={isActive ? '#ffffff' : hovered ? '#e4e4e7' : '#a1a1aa'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {link.label}
      </Text>
    </group>
  )
}

function SceneContents({
  phase,
  targetPos,
  activeId,
  onIconClick,
}: {
  phase: Phase
  targetPos: Pos3 | null
  activeId: string | null
  onIconClick: (link: LinkItem, pos: Pos3) => void
}) {
  const { viewport } = useThree()
  const isMobile = viewport.width < 4.8

  const getIconPos = (index: number): Pos3 => {
    if (isMobile) {
      // 2x2 Grid for mobile
      const cols = 2
      const xSpacing = 1.3
      const ySpacing = 1.4
      const row = Math.floor(index / cols)
      const col = index % cols
      const x = (col - (cols - 1) / 2) * xSpacing
      const y = 2.0 - row * ySpacing
      return [x, y, 0]
    } else {
      // Row of 4 for desktop
      const cols = 4
      const xSpacing = Math.min(1.4, viewport.width / 4)
      const x = (index - (cols - 1) / 2) * xSpacing
      return [x, 1.4, 0]
    }
  }

  return (
    <>
      <color attach="background" args={['#09090b']} />
      <Stars radius={100} depth={60} count={2500} factor={4} fade speed={0.8} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[0, -3, 0.8]} color="#f97316" intensity={3} distance={4} decay={2} />
      <Rocket phase={phase} targetPos={targetPos} />
      {LINKS.map((link, i) => (
        <Icon3D
          key={link.id}
          link={link}
          pos={getIconPos(i)}
          isActive={activeId === link.id}
          disabled={phase !== 'idle'}
          onIconClick={(l) => onIconClick(l, getIconPos(i))}
        />
      ))}
    </>
  )
}

// ── Exported component ────────────────────────────────────────────────────
export function ContactScene({ title }: { title: string }) {
  const [phase, setPhase]         = useState<Phase>('idle')
  const [targetPos, setTargetPos] = useState<Pos3 | null>(null)
  const [activeId, setActiveId]   = useState<string | null>(null)

  const handleIconClick = useCallback(
    (link: LinkItem, pos: Pos3) => {
      if (phase !== 'idle') return

      setTargetPos(pos)
      setActiveId(link.id)
      setPhase('flying')

      // Chrome はクリックから 1000ms 以内なら user activation が有効
      // FLY_DURATION(850ms) 後に window.open を呼んでも popup blocker に引っかからない
      const flyMs = Math.round(FLY_DURATION * 1000)

      setTimeout(() => {
        window.open(link.href, '_blank', 'noopener,noreferrer')
      }, flyMs)

      setTimeout(() => {
        setPhase('resetting')
        setTargetPos(null)
        setTimeout(() => {
          setPhase('idle')
          setActiveId(null)
        }, 80)
      }, flyMs + 120)
    },
    [phase],
  )

  return (
    <>
      {/* フルスクリーンキャンバス — ヘッダー下端(top-16)から画面底まで fixed */}
      <div className="fixed top-16 inset-x-0 bottom-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <SceneContents
              phase={phase}
              targetPos={targetPos}
              activeId={activeId}
              onIconClick={handleIconClick}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* タイトル — 左上に固定 */}
      <h1 className="fixed top-20 left-4 z-10 text-xs font-medium tracking-widest text-zinc-500">{title}</h1>
    </>
  )
}
