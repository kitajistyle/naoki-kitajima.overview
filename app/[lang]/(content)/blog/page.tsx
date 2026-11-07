import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { getBlogPosts } from '../../../../lib/data'
import { notFound } from 'next/navigation'
import { PageHeader } from '../../../components/ui/PageHeader'
import { PostList } from '../../../components/ui/PostList'

export async function generateMetadata({ params }: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'ブログ' : 'Blog',
    description: isJa
      ? 'きたじー（KITAJI）のブログ。ソフトウェアエンジニアリング、テクノロジー、日々の思いを発信。'
      : 'Blog by Kitaji (きたじー) — writing about software engineering, technology, and life.',
    keywords: isJa
      ? ['きたじー', 'KITAJI', 'ブログ', 'ソフトウェアエンジニアリング', '技術']
      : ['Kitaji', 'KITAJI', 'Blog', 'Software Engineering', 'Technology'],
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { en: '/en/blog', ja: '/ja/blog', 'x-default': '/en/blog' },
    },
  }
}

export default async function BlogPage({ params }: PageProps<'/[lang]/blog'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const posts = getBlogPosts(lang)

  return (
    <main>
      <PageHeader title="Blog" sub={dict.nav.blog} lead={dict.home.blog_lead} />
      <div className="mx-auto max-w-300 px-8 md:px-16">
        <PostList posts={posts} lang={lang} showExcerpt headingLevel="h2" />
      </div>
    </main>
  )
}
