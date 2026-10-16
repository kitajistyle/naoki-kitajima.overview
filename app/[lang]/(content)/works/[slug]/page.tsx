import type { Metadata } from 'next'
import Link from 'next/link'
import { AppStoreBadge } from '../../../../components/ui/AppStoreBadge'
import { getDictionary, hasLocale } from '../../../dictionaries'
import { getWorkBySlug, getWorks } from '../../../../../lib/data'
import { notFound } from 'next/navigation'
import { Scene } from '../../../../components/ui/Scene'

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
      ...(work.url ? { url: work.url } : {}),
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

  if (work.embed && work.url) {
    return (
      <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative z-10 -my-8 sm:-my-14 h-[calc(100dvh-4rem)]">
        <h1 className="sr-only">{work.title}</h1>
        <Link
          href={`/${lang}/works`}
          className="absolute top-4 left-6 sm:left-12 z-20 rounded-full border border-zinc-600 bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-300 backdrop-blur-sm transition-colors duration-200 hover:border-white hover:text-white"
        >
          ← {dict.nav.works}
        </Link>
        {work.links.length > 0 ? (
          <div className="absolute top-4 right-6 sm:right-12 z-20 flex gap-2">
            {work.links.map((link) =>
              link.label === 'App Store' ? (
                <AppStoreBadge key={link.url} href={link.url} />
              ) : (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-200"
                >
                  {link.label} ↗
                </a>
              )
            )}
          </div>
        ) : null}
        <iframe src={work.url} title={work.title} className="h-full w-full" />
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
        {work.links.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
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
      </div>
    </main>
    </>
  )
}
