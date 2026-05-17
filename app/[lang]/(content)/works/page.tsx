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

  return (
    <main>
      <h1>{dict.nav.works}</h1>
    </main>
  )
}
