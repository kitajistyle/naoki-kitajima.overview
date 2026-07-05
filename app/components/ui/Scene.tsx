'use client'

import dynamic from 'next/dynamic'

// Three.js scenes are client-only WebGL canvases. Loading them with
// `ssr: false` here (inside a Client Component) code-splits three.js out of
// the initial bundle — dynamic imports from Server Components do not split.
const scenes = {
  works: dynamic(() => import('./WorksScene').then((m) => m.WorksScene), { ssr: false }),
  blog: dynamic(() => import('./BlogScene').then((m) => m.BlogScene), { ssr: false }),
  about: dynamic(() => import('./AboutScene').then((m) => m.AboutScene), { ssr: false }),
  contact: dynamic(() => import('./ContactScene').then((m) => m.ContactScene), { ssr: false }),
  bboy: dynamic(() => import('./BboyScene').then((m) => m.BboyScene), {
    ssr: false,
    // BboyScene renders in-flow — reserve its height to avoid layout shift
    loading: () => <div className="w-full h-64 sm:h-80" />,
  }),
} as const

type Props = {
  name: keyof typeof scenes
}

export function Scene({ name }: Props) {
  const SceneComponent = scenes[name]
  return <SceneComponent />
}
