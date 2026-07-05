'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const FRAMES = ['/hero.png', '/hero_1.png', '/hero_2.png', '/hero_3.png', '/hero_4.png', '/hero_5.png']
const FRAME_MS = 200

export function LoadingGlobe() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAMES.length)
    }, FRAME_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div role="status" aria-label="Loading" className="flex flex-col items-center gap-6">
      <div className="relative size-40 sm:size-56">
        {FRAMES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="(max-width: 640px) 10rem, 14rem"
            className={`object-contain [image-rendering:pixelated] transition-opacity duration-100 ${i === frame ? 'opacity-90' : 'opacity-0'}`}
            preload
          />
        ))}
      </div>
      <p className="text-white text-xs font-medium tracking-[0.3em] uppercase select-none">
        Loading
      </p>
    </div>
  )
}
