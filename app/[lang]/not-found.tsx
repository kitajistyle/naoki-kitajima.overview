import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-6xl font-black tracking-tight">404</h1>
      <p className="text-sm text-zinc-400">Page not found</p>
      <Link
        href="/"
        className="px-6 py-2.5 text-sm font-medium rounded-full border border-zinc-700 text-white hover:border-white transition-colors duration-200"
      >
        Home
      </Link>
    </main>
  )
}
