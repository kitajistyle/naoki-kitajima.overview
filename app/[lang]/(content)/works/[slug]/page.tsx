import type { Metadata } from 'next'
import Link from 'next/link'
import { AppStoreBadge } from '../../../../components/ui/AppStoreBadge'
import { getDictionary, hasLocale } from '../../../dictionaries'
import { getWorkBySlug, getWorks } from '../../../../../lib/data'
import { notFound } from 'next/navigation'
import { PageHeader } from '../../../../components/ui/PageHeader'
import { ViewMoreLink } from '../../../../components/ui/ViewMoreLink'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kitajistyle.com'

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
      ? ['きたじー', 'KITAJI', '作品', ...work.tags]
      : ['Kitaji', 'KITAJI', 'Works', ...work.tags],
    alternates: {
      canonical: `/${lang}/works/${slug}`,
      languages: { en: `/en/works/${slug}`, ja: `/ja/works/${slug}`, 'x-default': `/en/works/${slug}` },
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

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: work.title,
      description: work.description,
      ...(work.url ? { url: new URL(work.url, siteUrl).href } : {}),
      author: {
        '@type': 'Person',
        name: 'きたじー',
        alternateName: 'きたじー',
        url: siteUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'Works', item: `${siteUrl}/${lang}/works` },
        { '@type': 'ListItem', position: 3, name: work.title, item: `${siteUrl}/${lang}/works/${slug}` },
      ],
    },
  ]

  const linkButtons = work.links.map((link) =>
    link.label === 'App Store' ? (
      <AppStoreBadge key={link.url} href={link.url} />
    ) : (
      <ViewMoreLink key={link.url} href={link.url} label={link.label} external />
    )
  )

  if (work.embed && work.url) {
    return (
      <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="-mb-24 flex h-dvh flex-col pt-16 md:-mb-32 md:pt-28">
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 pb-4 md:px-[max(64px,calc(50%-600px))]">
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}/works`}
              className="text-xs font-bold tracking-[0.12em] text-white/60 transition-colors hover:text-white"
            >
              ← Works
            </Link>
            <h1 className="text-lg font-bold">{work.title}</h1>
          </div>
        </div>
        <iframe src={work.url} title={work.title} className="w-full flex-1 bg-white" />
      </main>
      </>
    )
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <main>
      <PageHeader title={work.title} sub={work.comingSoon ? 'Coming Soon' : dict.nav.works} lead={work.description} />
      <div className="mx-auto max-w-300 space-y-12 px-8 md:px-16">
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {work.tags.map((tag) => (
            <li
              key={tag}
              className="bg-linear-to-r from-accent-from to-accent-to bg-size-[100%_1px] bg-bottom-left bg-no-repeat pb-1 text-sm font-bold"
            >
              {tag}
            </li>
          ))}
        </ul>
        {linkButtons.length > 0 || (work.url && !work.comingSoon) ? (
          <div className="flex flex-wrap items-center gap-8">
            {work.url && !work.comingSoon ? <ViewMoreLink href={work.url} label="Visit" external /> : null}
            {linkButtons}
          </div>
        ) : null}
        <ViewMoreLink href={`/${lang}/works`} label="Works" />
      </div>
    </main>
    </>
  )
}
