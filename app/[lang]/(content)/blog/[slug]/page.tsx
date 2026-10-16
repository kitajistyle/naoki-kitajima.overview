import type { Metadata } from 'next'
import Link from 'next/link'
import { hasLocale } from '../../../dictionaries'
import { getBlogPosts, getBlogPostBySlug } from '../../../../../lib/data'
import { notFound } from 'next/navigation'
import { Scene } from '../../../../components/ui/Scene'

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
      : ['Naoki Kitajima', 'KITAJI', 'Blog', ...post.tags],
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
        name: 'Naoki Kitajima',
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
      <Scene name="blog" />
      <main className="relative z-10 px-6 sm:px-12">
        <div className="max-w-2xl mx-auto">
        <Link
          href={`/${lang}/blog`}
          className="text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition-colors duration-200 mb-10 inline-block"
        >
          ← Blog
        </Link>
        <time className="block text-xs tracking-widest text-zinc-500 uppercase mb-4">
          {post.date}
        </time>
        <h1 className="text-3xl font-black tracking-tight mb-4">{post.title}</h1>
        <div className="flex gap-2 mb-10">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] tracking-widest uppercase text-zinc-600 border border-zinc-800 px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          className="blog-content flex flex-col gap-5 text-zinc-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
      </main>
    </>
  )
}
