import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { getWorks } from '../../../../lib/data'
import { notFound } from 'next/navigation'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WorksGrid } from '../../../components/ui/WorksGrid'

export async function generateMetadata({ params }: PageProps<'/[lang]/works'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? '作品' : 'Works',
    description: isJa
      ? 'きたじー（KITAJI）の作品一覧。React・TypeScript・Next.js・Go を使ったプロジェクト。'
      : 'Works and projects by Kitaji (きたじー) — React, TypeScript, Next.js, Go.',
    keywords: isJa
      ? ['きたじー', 'KITAJI', '作品', 'ポートフォリオ', 'React', 'TypeScript', 'Next.js', 'Go']
      : ['Kitaji', 'KITAJI', 'Works', 'Portfolio', 'React', 'TypeScript', 'Next.js', 'Go'],
    alternates: {
      canonical: `/${lang}/works`,
      languages: { en: '/en/works', ja: '/ja/works', 'x-default': '/en/works' },
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
      <PageHeader title="Works" sub={dict.nav.works} lead={dict.home.works_lead} />
      <div className="mx-auto max-w-332 px-8 md:px-16">
        <WorksGrid works={works} lang={lang} viewDetailLabel={dict.home.view_detail} headingLevel="h2" />
      </div>
    </main>
  )
}
