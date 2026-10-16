import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { notFound } from 'next/navigation'
import { Scene } from '../../../components/ui/Scene'

export async function generateMetadata({ params }: PageProps<'/[lang]/like'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'お気に入り' : 'Like',
    description: isJa
      ? 'きたじー（KITAJI）の好きなこと。Bboy / ブレイクダンス、コーヒー・バリスタ。'
      : 'Things Kitaji (きたじー) loves — Bboy / Breakdancing, Coffee & Barista.',
    keywords: isJa
      ? ['きたじー', 'KITAJI', 'Bboy', 'ブレイクダンス', 'コーヒー', 'バリスタ']
      : ['Kitaji', 'KITAJI', 'Bboy', 'Breakdancing', 'Coffee', 'Barista'],
    alternates: {
      canonical: `/${lang}/like`,
      languages: { en: '/en/like', ja: '/ja/like', 'x-default': '/en/like' },
    },
  }
}

export default async function LikePage({ params }: PageProps<'/[lang]/like'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const { like } = dict

  return (
    <main className="px-6 sm:px-12">
      <div className="max-w-2xl mx-auto space-y-16">
        <h1 className="text-4xl font-black tracking-tight mb-12">{like.heading}</h1>

        {/* Bboy section */}
        <section className="space-y-8">
          <Scene name="bboy" />

          <h2 className="text-2xl font-bold">{like.bboy_title}</h2>

          <div className="space-y-5">
            {like.bboy_paragraphs.map((paragraph, i) => (
              <p key={i} className="text-zinc-400 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
