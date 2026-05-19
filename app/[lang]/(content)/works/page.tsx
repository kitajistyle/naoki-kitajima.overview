import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { getWorks } from '../../../../lib/data'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: PageProps<'/[lang]/works'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? '制作物' : 'Works',
    description: isJa
      ? '北島直樹（きたじー / KITAJI）の制作物一覧。React・TypeScript・Next.js・Go を使ったプロジェクト。'
      : 'Works and projects by Naoki Kitajima (KITAJI) — React, TypeScript, Next.js, Go.',
    keywords: isJa
      ? ['北島直樹', 'KITAJI', '制作物', 'ポートフォリオ', 'React', 'TypeScript', 'Next.js', 'Go']
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
  const isJa = lang === 'ja'

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-12">{dict.nav.works}</h1>
      <ul className="space-y-8">
        {works.map((work) => (
          <li key={work.slug}>
            {work.comingSoon ? (
              <div className="group border border-zinc-800 rounded-2xl p-6 opacity-60">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-xl font-semibold text-white">{work.title}</h2>
                  <span className="shrink-0 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full border border-zinc-600 text-zinc-400">
                    {isJa ? 'Coming Soon' : 'Coming Soon'}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{work.description}</p>
                <ul className="flex flex-wrap gap-2">
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
            ) : (
              <a
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-xl font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    {work.title}
                  </h2>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{work.description}</p>
                <ul className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
