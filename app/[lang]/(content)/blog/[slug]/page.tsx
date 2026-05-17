import type { Metadata } from 'next'
import Link from 'next/link'
import { hasLocale } from '../../../dictionaries'
import { getBlogPosts, getBlogPostBySlug } from '../../../../../lib/data'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = getBlogPosts('en')
  return posts.map((post) => ({ slug: post.slug }))
}

type Params = Promise<{ lang: string; slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const post = getBlogPostBySlug(lang, slug)
  if (!post) notFound()
  const isJa = lang === 'ja'
  return {
    title: post.title,
    description: post.excerpt,
    keywords: isJa
      ? ['北島直樹', 'きたじー', 'KITAJI', 'ブログ', ...post.tags]
      : ['Naoki Kitajima', 'KITAJI', 'Blog', ...post.tags],
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: { en: `/en/blog/${slug}`, ja: `/ja/blog/${slug}` },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const post = getBlogPostBySlug(lang, slug)
  if (!post) notFound()

  return (
    <main className="px-6 sm:px-12">
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
        <div className="flex flex-col gap-5 text-zinc-300 leading-relaxed">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  )
}
