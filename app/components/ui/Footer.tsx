import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com/kitajistyle' },
  { label: 'X', url: 'https://x.com/kitajistyle' },
  { label: 'Zenn', url: 'https://zenn.dev/kitajistyle' },
] as const

export function Footer({ fixed = false }: { fixed?: boolean }) {
  return (
    <footer className={`${fixed ? 'fixed bottom-0 left-0 right-0 z-30' : ''} px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 bg-transparent`}>
      <p>© {new Date().getFullYear()} Naoki Kitajima</p>
      <nav aria-label="Social links" className="flex gap-6">
        {SOCIAL_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
