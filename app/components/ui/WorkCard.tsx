import Image from 'next/image'
import Link from 'next/link'
import type { Work } from '../../../lib/data'
import { ArrowCircle } from './ArrowCircle'

type Props = {
  work: Work
  lang: string
  viewDetailLabel: string
  headingLevel?: 'h2' | 'h3'
}

export function WorkCard({ work, lang, viewDetailLabel, headingLevel: Heading = 'h3' }: Props) {
  return (
    <Link
      href={`/${lang}/works/${work.slug}`}
      className="group relative block h-64 overflow-hidden bg-ink-deep md:h-full"
    >
      {work.image ? (
        <Image
          src={work.image}
          alt={work.title}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-end bg-linear-to-br from-accent-from/40 via-ink-deep to-accent-to/40 p-6 transition-transform duration-700 group-hover:scale-105 md:p-10">
          <span aria-hidden="true" className="text-6xl font-bold tracking-tighter text-white/15 md:text-8xl">
            {work.title}
          </span>
        </div>
      )}

      {work.comingSoon ? (
        <span className="absolute top-4 left-4 z-10 border border-white/40 bg-ink/70 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">
          Coming Soon
        </span>
      ) : null}

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-10 text-center text-white opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <span className="bg-linear-to-r from-accent-from to-accent-to bg-size-[100%_1px] bg-bottom-left bg-no-repeat px-1 py-1.5 text-sm font-bold">
          {work.tags.slice(0, 2).join(' / ')}
        </span>
        <Heading className="mt-4 text-2xl font-bold">{work.title}</Heading>
        <span className="mt-8 hidden items-center md:flex md:mt-12">
          <span className="relative z-10 -mr-4 text-sm font-bold tracking-[0.12em]">{viewDetailLabel}</span>
          <ArrowCircle />
        </span>
      </div>
    </Link>
  )
}
