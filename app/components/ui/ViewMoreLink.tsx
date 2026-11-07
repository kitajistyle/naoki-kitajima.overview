import Link from 'next/link'
import { ArrowCircle } from './ArrowCircle'

type Props = {
  href: string
  label: string
  tone?: 'light' | 'dark'
  external?: boolean
}

export function ViewMoreLink({ href, label, tone = 'light', external = false }: Props) {
  const className = `group inline-flex items-center ${tone === 'light' ? 'text-white' : 'text-ink'}`
  const content = (
    <>
      <span className="relative z-10 -mr-4 text-sm font-bold tracking-[0.12em]">{label}</span>
      <ArrowCircle />
    </>
  )

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}
