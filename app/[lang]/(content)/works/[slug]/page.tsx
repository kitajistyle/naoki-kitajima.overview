import type { Metadata } from 'next'
import { hasLocale } from '../../../dictionaries'
import { getWorkBySlug, getWorks } from '../../../../../lib/data'
import { notFound } from 'next/navigation'

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
      ? ['北島直樹', 'KITAJI', '制作物', ...work.tags]
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

  return (
    <main>
      <h1>{work.title}</h1>
      <p>{work.description}</p>
    </main>
  )
}
