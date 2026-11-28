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
      ? 'きたじー（KITAJI）の作品一覧。App Store で公開中の CypherMap・おくすりびよりをはじめ、React Native・Expo・TypeScript・Go でつくったアプリ。'
      : 'Works by Kitaji (きたじー) — apps built with React Native, Expo, TypeScript, and Go, including CypherMap and Okusuri Biyori on the App Store.',
    keywords: isJa
      ? ['きたじー', 'KITAJI', '作品', 'ポートフォリオ', 'アプリ', 'React Native', 'Expo', 'TypeScript', 'Go']
      : ['Kitaji', 'KITAJI', 'Works', 'Portfolio', 'Apps', 'React Native', 'Expo', 'TypeScript', 'Go'],
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
        <WorksGrid works={works} lang={lang} viewDetailLabel={dict.home.view_detail} availableLabel={dict.home.available} headingLevel="h2" />
      </div>
    </main>
  )
}
