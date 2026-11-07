import type { Metadata } from 'next'
import Image from 'next/image'
import { getDictionary, hasLocale } from './dictionaries'
import { notFound } from 'next/navigation'
import { getBlogPosts, getProfile, getWorks } from '../../lib/data'
import { ViewMoreLink } from '../components/ui/ViewMoreLink'
import { SectionHeading } from '../components/ui/SectionHeading'
import { WorksGrid } from '../components/ui/WorksGrid'
import { PostList } from '../components/ui/PostList'
import { SocialIcon } from '../components/ui/SocialIcon'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'きたじー',
  alternateName: ['Kitaji', 'KITAJI', 'kitajistyle'],
  jobTitle: 'Software Engineer / SRE',
  url: 'https://kitajistyle.com',
  sameAs: [
    'https://github.com/kitajistyle',
    'https://x.com/kitajistyIe',
    'https://zenn.dev/kitajistyle',
    'https://linkedin.com/in/kitajistyle',
  ],
}

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'きたじー' : 'Kitaji',
    description: isJa
      ? 'きたじー（KITAJI）のポートフォリオ。ソフトウェアエンジニア / SRE。東京理科大学卒。Bboy。'
      : 'Portfolio of Kitaji (きたじー) — Software Engineer / SRE based in Japan. Physics graduate from Tokyo University of Science. Bboy.',
    keywords: isJa
      ? ['きたじー', 'KITAJI', 'kitajistyle', 'ポートフォリオ', 'ソフトウェアエンジニア', 'SRE', 'Bboy']
      : ['Kitaji', 'KITAJI', 'kitajistyle', 'Portfolio', 'Software Engineer', 'SRE', 'Bboy', 'Breakdancing'],
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', ja: '/ja', 'x-default': '/en' },
    },
    openGraph: {
      url: `/${lang}`,
      title: isJa ? 'きたじー | KITAJI' : 'Kitaji | KITAJI',
      description: isJa
        ? 'きたじー（KITAJI）のポートフォリオ。ソフトウェアエンジニア / SRE。'
        : 'Portfolio of Kitaji (きたじー) — Software Engineer / SRE based in Japan.',
    },
  }
}

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const profile = getProfile(lang)
  const works = getWorks(lang)
  const posts = getBlogPosts(lang).slice(0, 3)
  const { home } = dict

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <main>
      {/* Hero — fixed background video; following sections scroll over it */}
      <section className="relative">
        <div className="fixed inset-0 -z-10 bg-ink">
          <video
            className="size-full object-cover"
            src="/videos/hero.mp4"
            poster="/videos/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>

        <div className="relative flex min-h-svh flex-col justify-center px-8 md:mx-auto md:w-215 md:px-0">
          <p className="text-xs font-bold tracking-[0.2em] text-white/70">{home.role}</p>
          <h1 className="mt-6 text-[30px] leading-[46px] font-bold text-white md:text-6xl md:leading-20">
            {home.hero_lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <div className="mt-10 md:mt-14">
            <ViewMoreLink href={`/${lang}/works`} label={home.view_works} />
          </div>
          <div
            aria-hidden="true"
            className="absolute -right-1 bottom-20 w-20 -rotate-90 animate-pulse bg-linear-to-r from-accent-from to-accent-to bg-size-[100%_1px] bg-bottom-left bg-no-repeat pb-1 text-right text-xs tracking-widest text-white uppercase md:-right-9 md:w-25 md:text-sm"
          >
            {home.scroll}
          </div>
        </div>

        <div className="px-8 pt-40 pb-20 md:mx-auto md:w-215 md:px-0 md:pt-60 md:pb-25">
          <p className="max-w-2xl text-sm leading-loose text-white md:text-base md:leading-loose">
            {profile.bio}
          </p>
          <div className="mt-8">
            <ViewMoreLink href={`/${lang}/about`} label={home.about_cta} />
          </div>
        </div>
      </section>

      {/* Blog — latest posts, news-list style */}
      <section className="bg-white px-8 pt-16 pb-18 text-ink md:pt-24 md:pb-24">
        <div className="mx-auto max-w-215">
          <SectionHeading title="Blog" lead={home.blog_lead} tone="dark" />
          <div className="mt-10">
            <PostList posts={posts} lang={lang} tone="dark" />
          </div>
          <div className="mt-12 flex justify-center">
            <ViewMoreLink href={`/${lang}/blog`} label={home.view_more} tone="dark" />
          </div>
        </div>
      </section>

      {/* Works */}
      <section className="bg-ink pt-22 pb-30 text-white">
        <div className="mx-auto max-w-247 px-8 md:px-16">
          <SectionHeading title="Works" lead={home.works_lead} />
        </div>
        <div className="mx-auto mt-12 max-w-332 px-8 md:px-16">
          <WorksGrid works={works} lang={lang} viewDetailLabel={home.view_detail} />
        </div>
        <div className="mt-20 flex justify-center">
          <ViewMoreLink href={`/${lang}/works`} label={home.view_more} />
        </div>
      </section>

      {/* Like — photo banner */}
      <section className="relative isolate overflow-hidden px-8 py-24 text-white md:py-36">
        <Image
          src="/bboy.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-ink/70" />
        <div className="mx-auto max-w-215">
          <SectionHeading title="Like" lead={home.like_lead} />
          <div className="mt-10">
            <ViewMoreLink href={`/${lang}/like`} label={home.view_more} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white px-8 py-20 text-ink md:py-28">
        <div className="mx-auto max-w-215">
          <SectionHeading title="Contact" lead={dict.contact.lead} tone="dark" />
          <ul className="mt-10 flex flex-wrap gap-3">
            {profile.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-ink/15 px-5 py-3 text-sm font-bold tracking-[0.08em] transition-colors duration-200 hover:border-transparent hover:bg-linear-to-r hover:from-accent-from hover:to-accent-to hover:text-white"
                >
                  <SocialIcon label={link.label} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
    </>
  )
}
