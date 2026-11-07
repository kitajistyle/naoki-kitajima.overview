import Link from 'next/link'
import { ArrowCircle } from '../components/ui/ArrowCircle'

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
      <h1 className="text-7xl font-bold tracking-tight md:text-9xl">404</h1>
      <span className="block h-px w-2.5 bg-linear-to-r from-accent-from to-accent-to" />
      <p className="text-sm text-white/60">Page not found</p>
      <Link href="/" className="group mt-4 inline-flex items-center text-white">
        <span className="relative z-10 -mr-4 text-sm font-bold tracking-[0.12em]">Home</span>
        <ArrowCircle />
      </Link>
    </main>
  )
}
