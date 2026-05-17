import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../dictionaries'
import { getBlogPosts } from '../../../../lib/data'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'ブログ' : 'Blog',
    description: isJa
      ? '北島直樹（きたじー / KITAJI）のブログ。ソフトウェアエンジニアリング、テクノロジー、日々の思いを発信。'
      : 'Blog by Naoki Kitajima (KITAJI) — writing about software engineering, technology, and life.',
    keywords: isJa
      ? ['北島直樹', 'きたじー', 'KITAJI', 'ブログ', 'ソフトウェアエンジニアリング', '技術']
      : ['Naoki Kitajima', 'KITAJI', 'Blog', 'Software Engineering', 'Technology'],
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { en: '/en/blog', ja: '/ja/blog' },
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const posts = getBlogPosts(lang)

  return (
    <main className="px-6 sm:px-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight mb-12">{dict.nav.blog}</h1>
        <ul className="flex flex-col gap-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${lang}/blog/${post.slug}`}
                className="group flex flex-col gap-2"
              >
                <time className="text-xs tracking-widest text-zinc-500 uppercase">
                  {post.date}
                </time>
                <h2 className="text-xl font-semibold group-hover:text-zinc-300 transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{post.excerpt}</p>
                <div className="flex gap-2 mt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] tracking-widest uppercase text-zinc-600 border border-zinc-800 px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
