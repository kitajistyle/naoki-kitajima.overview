import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { notFound } from 'next/navigation'
import { Scene } from '../../../components/ui/Scene'
import { PageHeader } from '../../../components/ui/PageHeader'

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
    <main>
      <PageHeader title="Like" sub={like.heading} lead={dict.home.like_lead} />
      <section className="mx-auto max-w-300 px-8 md:px-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center md:gap-16">
          <div className="bg-ink-deep">
            <Scene name="bboy" />
          </div>
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{like.bboy_title}</h2>
            <span className="mt-5 block h-px w-2.5 bg-linear-to-r from-accent-from to-accent-to" />
            <div className="mt-6 space-y-5">
              {like.bboy_paragraphs.map((paragraph, i) => (
                <p key={i} className="text-sm leading-loose text-white/80 md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
