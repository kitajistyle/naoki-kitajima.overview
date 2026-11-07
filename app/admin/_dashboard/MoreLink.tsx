import Link from 'next/link'

export function MoreLink({ href, label = 'すべて見る' }: { href: string; label?: string }) {
  return (
    <Link href={href} className="text-xs font-bold text-[#2456E8] whitespace-nowrap hover:underline">
      {label} →
    </Link>
  )
}
