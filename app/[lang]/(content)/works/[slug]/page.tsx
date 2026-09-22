import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../../dictionaries'
import { getWorkBySlug, getWorks } from '../../../../../lib/data'
import { notFound } from 'next/navigation'
import { Scene } from '../../../../components/ui/Scene'

export async function generateStaticParams() {
  const enWorks = getWorks('en')
  return enWorks.map((work) => ({ slug: work.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/works/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const work = getWorkBySlug(lang, slug)
  if (!work) notFound()
  const isJa = lang === 'ja'
  return {
    title: work.title,
    description: work.description,
    keywords: isJa
      ? ['北島直樹', 'KITAJI', '作品', ...work.tags]
      : ['Naoki Kitajima', 'KITAJI', 'Works', ...work.tags],
    alternates: {
      canonical: `/${lang}/works/${slug}`,
      languages: { en: `/en/works/${slug}`, ja: `/ja/works/${slug}` },
    },
    openGraph: {
      title: work.title,
      description: work.description,
    },
  }
}

export default async function WorkDetailPage({ params }: PageProps<'/[lang]/works/[slug]'>) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const work = getWorkBySlug(lang, slug)
  if (!work) notFound()
  const dict = await getDictionary(lang)

  if (work.embed && work.url) {
    return (
      <main className="relative z-10 -my-8 sm:-my-14 h-[calc(100dvh-4rem)]">
        <h1 className="sr-only">{work.title}</h1>
        <Link
          href={`/${lang}/works`}
          className="absolute top-4 left-6 sm:left-12 z-20 rounded-full border border-zinc-600 bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-300 backdrop-blur-sm transition-colors duration-200 hover:border-white hover:text-white"
        >
          ← {dict.nav.works}
        </Link>
        <iframe src={work.url} title={work.title} className="h-full w-full" />
      </main>
    )
  }

  return (
    <>
    <Scene name="works" />
    <main className="relative z-10 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${lang}/works`}
          className="inline-block text-sm text-zinc-400 hover:text-white transition-colors duration-200 mb-10"
        >
          ← {dict.nav.works}
        </Link>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-black tracking-tight">{work.title}</h1>
          {work.comingSoon ? (
            <span className="shrink-0 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full border border-zinc-600 text-zinc-400">
              Coming Soon
            </span>
          ) : work.url ? (
            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full border border-zinc-600 text-zinc-400 hover:border-white hover:text-white transition-colors duration-200"
            >
              Visit ↗
            </a>
          ) : null}
        </div>
        <p className="text-zinc-400 leading-relaxed mb-6">{work.description}</p>
        <ul className="flex flex-wrap gap-2 mb-12">
          {work.tags.map((tag) => (
            <li
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </main>
    </>
  )
}
