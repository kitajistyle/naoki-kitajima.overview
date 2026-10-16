import { FaApple } from 'react-icons/fa6'

type Props = {
  href: string
  className?: string
}

export function AppStoreBadge({ href, className = '' }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-lg border border-zinc-600 bg-black px-4 py-2 text-white transition-colors duration-200 hover:border-white hover:bg-zinc-900 ${className}`}
    >
      <FaApple aria-hidden="true" className="text-2xl" />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium tracking-wide text-zinc-300">
          Download on the
        </span>
        <span className="text-base font-semibold">App Store</span>
      </span>
    </a>
  )
}
