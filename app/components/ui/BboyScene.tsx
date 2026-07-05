'use client'

import { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function BboyCharacter() {
  const group = useRef<THREE.Group>(null)
  
  // Load the breakdance model with embedded animations
  const { scene, animations } = useGLTF('/DanceOff.glb')
  const { actions } = useAnimations(animations, group)

  // Traverse the scene once to enable shadows
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    // List of only breakdance action names in DanceOff.glb
    const possibleActions = ['Flair', 'Break Dance1']
    const availableActions = Object.keys(actions)
    
    // Filter animations that are actually loaded
    const danceList = possibleActions.filter(name => availableActions.includes(name))
    
    if (danceList.length === 0) {
      // Fallback to whatever actions exist
      if (availableActions.length > 0) {
        danceList.push(availableActions[0])
      } else {
        return
      }
    }

    let currentIndex = 0
    let activeAction = actions[danceList[currentIndex]]

    if (activeAction) {
      activeAction.play()
    }

    // Cycle through breakdance moves every 8 seconds with a smooth crossfade
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % danceList.length
      const nextActionName = danceList[nextIndex]
      const nextAction = actions[nextActionName]

      if (activeAction && nextAction) {
        // Smoothly blend to the next breakdance move
        nextAction.reset()
        nextAction.setEffectiveTimeScale(1)
        nextAction.setEffectiveWeight(1)
        nextAction.play()
        
        activeAction.crossFadeTo(nextAction, 0.8, true)
        
        activeAction = nextAction
        currentIndex = nextIndex
      }
    }, 8000)

    return () => {
      clearInterval(interval)
      if (activeAction) activeAction.stop()
    }
  }, [actions])

  return (
    // Scale and position adjusted for Ready Player Me avatar to sit nicely on the floor grid
    <group ref={group} position={[0, -1.05, 0]} scale={0.95} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

export function BboyScene() {
  return (
    <div className="w-full h-64 sm:h-80 relative">
      <Canvas
        camera={{ position: [0, 1.5, 3.0], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          
          {/* Main directional light with shadow setup */}
          <directionalLight
            position={[3, 5, 3]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />
          
          {/* Neon cyberpunk visual theme lights */}
          <pointLight position={[-3, 2, 1]} color="#f43f5e" intensity={3.0} distance={6} decay={1.5} />
          <pointLight position={[3, 2, 2]}  color="#0ea5e9" intensity={2.5} distance={6} decay={1.5} />
          <pointLight position={[0, -0.8, 0.5]} color="#a855f7" intensity={2.0} distance={4} decay={2} />

          {/* Breakdancing Character */}
          <BboyCharacter />
          
          {/* Floor mesh to receive dancing shadow casting */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.055, 0]} receiveShadow>
            <planeGeometry args={[15, 15]} />
            <shadowMaterial opacity={0.45} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  )
}

// Pre-preload the asset for seamless performance
useGLTF.preload('/DanceOff.glb')
