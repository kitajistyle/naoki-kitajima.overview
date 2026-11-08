import type { Metadata } from 'next'
import Link from 'next/link'
import { hasLocale } from '../../../dictionaries'
import { getBlogPosts, getBlogPostBySlug } from '../../../../../lib/data'
import { notFound } from 'next/navigation'
import { ViewMoreLink } from '../../../../components/ui/ViewMoreLink'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kitajistyle.com'

export async function generateStaticParams() {
  const posts = getBlogPosts('en')
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/blog/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const post = getBlogPostBySlug(lang, slug)
  if (!post) notFound()
  const isJa = lang === 'ja'
  return {
    title: post.title,
    description: post.excerpt,
    keywords: isJa
      ? ['きたじー', 'KITAJI', 'ブログ', ...post.tags]
      : ['Kitaji', 'KITAJI', 'Blog', ...post.tags],
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: { en: `/en/blog/${slug}`, ja: `/ja/blog/${slug}`, 'x-default': `/en/blog/${slug}` },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const post = getBlogPostBySlug(lang, slug)
  if (!post) notFound()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      inLanguage: lang,
      author: {
        '@type': 'Person',
        name: 'きたじー',
        alternateName: 'きたじー',
        url: siteUrl,
      },
      mainEntityOfPage: `${siteUrl}/${lang}/blog/${slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/${lang}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/${lang}/blog/${slug}` },
      ],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <header className="mx-auto max-w-190 px-8 pt-36 pb-12 md:pt-48 md:pb-16">
          <Link
            href={`/${lang}/blog`}
            className="text-xs font-bold tracking-[0.12em] text-white/60 transition-colors hover:text-white"
          >
            ← Blog
          </Link>
          <time dateTime={post.date} className="mt-10 block font-mono text-xs tracking-widest text-white/60">
            {post.date.replaceAll('-', '.')}
          </time>
          <h1 className="mt-4 text-2xl leading-snug font-bold md:text-4xl md:leading-snug">{post.title}</h1>
          <ul className="mt-6 flex flex-wrap gap-3 text-[10px] tracking-widest text-white/60 uppercase">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
          <span className="mt-10 block h-px bg-linear-to-r from-accent-from to-accent-to" />
        </header>
        <div
          className="blog-content mx-auto flex max-w-190 flex-col gap-5 px-8 leading-loose text-white/85"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        <div className="mx-auto mt-20 max-w-190 px-8">
          <ViewMoreLink href={`/${lang}/blog`} label="Blog" />
        </div>
      </main>
    </>
  )
}
