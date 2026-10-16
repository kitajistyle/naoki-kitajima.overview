import type { Metadata } from 'next'
import Link from 'next/link'
import { AppStoreBadge } from '../../../components/ui/AppStoreBadge'
import { getDictionary, hasLocale } from '../../dictionaries'
import { getWorks } from '../../../../lib/data'
import { notFound } from 'next/navigation'
import { Scene } from '../../../components/ui/Scene'

export async function generateMetadata({ params }: PageProps<'/[lang]/works'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? '作品' : 'Works',
    description: isJa
      ? 'きたじー（KITAJI）の作品一覧。React・TypeScript・Next.js・Go を使ったプロジェクト。'
      : 'Works and projects by Naoki Kitajima (KITAJI) — React, TypeScript, Next.js, Go.',
    keywords: isJa
      ? ['きたじー', 'KITAJI', '作品', 'ポートフォリオ', 'React', 'TypeScript', 'Next.js', 'Go']
      : ['Naoki Kitajima', 'KITAJI', 'Works', 'Portfolio', 'React', 'TypeScript', 'Next.js', 'Go'],
    alternates: {
      canonical: `/${lang}/works`,
      languages: { en: '/en/works', ja: '/ja/works' },
    },
  }
}

export default async function WorksPage({ params }: PageProps<'/[lang]/works'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const works = getWorks(lang)

  return (
    <>
    <Scene name="works" />
    <main className="relative z-10 px-6 sm:px-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight mb-12">{dict.nav.works}</h1>
        <ul className="space-y-8">
          {works.map((work) => {
            const cardContent = (
              <>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-xl font-semibold text-white transition-colors group-hover:text-zinc-200">
                    {work.comingSoon ? (
                      work.title
                    ) : work.embed ? (
                      <Link
                        href={`/${lang}/works/${work.slug}`}
                        className="inline-flex items-center gap-2 after:absolute after:inset-0 after:content-['']"
                      >
                        {work.title}
                        <span
                          aria-hidden="true"
                          className="text-sm text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                        >
                          →
                        </span>
                      </Link>
                    ) : (
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 after:absolute after:inset-0 after:content-['']"
                      >
                        {work.title}
                        <span
                          aria-hidden="true"
                          className="text-sm text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                        >
                          ↗
                        </span>
                      </a>
                    )}
                  </h2>
                  {work.comingSoon ? (
                    <span className="shrink-0 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full border border-zinc-700 text-zinc-500">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4 transition-colors group-hover:text-zinc-300">
                  {work.description}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 transition-colors group-hover:bg-zinc-700/70 group-hover:text-zinc-300"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                {work.links.length > 0 ? (
                  <ul className="relative z-10 mt-4 flex flex-wrap gap-2">
                    {work.links.map((link) => (
                      <li key={link.url}>
                        {link.label === 'App Store' ? (
                          <AppStoreBadge href={link.url} />
                        ) : (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:border-zinc-400 hover:text-white"
                          >
                            {link.label} ↗
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            )
            return (
              <li key={work.slug}>
                <div
                  className={
                    work.comingSoon
                      ? 'border border-dashed border-zinc-800 rounded-2xl p-6 opacity-50'
                      : 'group relative rounded-2xl border border-zinc-700/80 bg-gradient-to-b from-zinc-900/70 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:from-zinc-900 hover:to-zinc-900/30 hover:shadow-2xl hover:shadow-sky-500/10'
                  }
                >
                  {cardContent}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
    </>
  )
}
