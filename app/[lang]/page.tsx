import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getDictionary, hasLocale } from './dictionaries'
import { notFound } from 'next/navigation'
import { Footer } from '../components/ui/Footer'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Naoki Kitajima',
  alternateName: ['北島直樹', 'きたじー', 'KITAJI', 'kitajistyle'],
  jobTitle: 'Software Engineer / SRE',
  url: 'https://kitajistyle.com',
  sameAs: [
    'https://github.com/kitajistyle',
    'https://x.com/kitajistyle',
    'https://zenn.dev/kitajistyle',
    'https://linkedin.com/in/kitajistyle',
  ],
}

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? '北島直樹 | KITAJI' : 'Naoki Kitajima | KITAJI',
    description: isJa
      ? '北島直樹（きたじー / KITAJI）のポートフォリオ。ソフトウェアエンジニア / SRE。東京理科大学卒。Bboy。'
      : 'Portfolio of Naoki Kitajima (KITAJI) — Software Engineer / SRE based in Japan. Physics graduate from Tokyo University of Science. Bboy.',
    keywords: isJa
      ? ['北島直樹', 'きたじー', 'KITAJI', 'kitajistyle', 'ポートフォリオ', 'ソフトウェアエンジニア', 'SRE', 'Bboy']
      : ['Naoki Kitajima', 'KITAJI', 'kitajistyle', 'Portfolio', 'Software Engineer', 'SRE', 'Bboy', 'Breakdancing'],
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', ja: '/ja' },
    },
    openGraph: {
      url: `/${lang}`,
      title: isJa ? '北島直樹 | KITAJI' : 'Naoki Kitajima | KITAJI',
      description: isJa
        ? '北島直樹（きたじー / KITAJI）のポートフォリオ。ソフトウェアエンジニア / SRE。'
        : 'Portfolio of Naoki Kitajima (KITAJI) — Software Engineer / SRE based in Japan.',
    },
  }
}

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <main className="relative flex-1 flex items-center justify-center overflow-hidden">
      {/* Decorative pixel earth */}
      <div className="fixed inset-y-0 left-[-40%] md:left-[-20%] w-[140%] md:w-[80%] pointer-events-none -z-10">
        <Image
          src="/hero.png"
          alt=""
          fill
          className="object-contain object-left scale-[1.15] origin-left [image-rendering:pixelated] opacity-90 transition-transform duration-700"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-12 flex flex-col items-end gap-6">
        <p className="text-white text-xs sm:text-sm font-medium tracking-[0.3em] uppercase">
          {dict.home.role}
        </p>

        <h1 className="text-[6rem] sm:text-[9rem] md:text-[14rem] lg:text-[18rem] xl:text-[22rem] font-black font-mono tracking-tighter leading-none select-none text-white drop-shadow-2xl">
          KITAJI
        </h1>

        <p className="text-white text-sm sm:text-base max-w-xs text-right leading-relaxed">
          {dict.home.tagline}
        </p>

        <div className="flex gap-3">
          <Link
            href={`/${lang}/works`}
            className="px-6 py-2.5 text-sm font-medium rounded-full border border-zinc-700 text-white hover:border-white transition-colors duration-200"
          >
            {dict.home.cta_works}
          </Link>
          <Link
            href={`/${lang}/about`}
            className="px-6 py-2.5 text-sm font-medium rounded-full border border-zinc-700 text-white hover:border-white transition-colors duration-200"
          >
            {dict.home.cta_about}
          </Link>
        </div>
      </div>
    </main>
    <Footer fixed />
    </>
  )
}
