import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { getProfile } from '../../../../lib/data'
import { notFound } from 'next/navigation'
import { PageHeader } from '../../../components/ui/PageHeader'

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'プロフィール' : 'About',
    description: isJa
      ? 'きたじー（KITAJI）のプロフィール。東京理科大学理学部物理学科卒、ソフトウェアエンジニア / SRE。Bboy。'
      : 'Profile of Kitaji (きたじー) — Software Engineer / SRE. Physics graduate from Tokyo University of Science. Bboy.',
    keywords: isJa
      ? ['きたじー', 'KITAJI', 'プロフィール', 'ソフトウェアエンジニア', 'SRE', '経歴']
      : ['Kitaji', 'KITAJI', 'About', 'Software Engineer', 'SRE', 'Profile'],
    alternates: {
      canonical: `/${lang}/about`,
      languages: { en: '/en/about', ja: '/ja/about', 'x-default': '/en/about' },
    },
  }
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const profile = getProfile(lang)

  return (
    <main>
      <PageHeader title="About" sub={dict.nav.about} />
      <div className="mx-auto max-w-300 space-y-20 px-8 md:space-y-28 md:px-16">
        <section className="grid gap-6 md:grid-cols-[240px_1fr] md:gap-16">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">{profile.name}</h2>
            <p className="mt-3 text-xs font-bold tracking-[0.12em] text-white/60">
              {profile.role} · {profile.location}
            </p>
          </div>
          <p className="text-sm leading-loose text-white/85 md:text-base md:leading-loose">{profile.bio}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-[240px_1fr] md:gap-16">
          <h2 className="text-xl font-bold tracking-[0.08em]">{dict.about.career}</h2>
          <dl>
            {profile.career.map((item) => (
              <div
                key={item.org}
                className="grid gap-1 border-b border-white/10 py-5 first:border-t sm:grid-cols-[1fr_auto] sm:gap-6"
              >
                <dt className="text-sm font-bold md:text-base">{item.org}</dt>
                <dd className="text-xs text-white/60 md:text-sm">{item.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="grid gap-6 md:grid-cols-[240px_1fr] md:gap-16">
          <h2 className="text-xl font-bold tracking-[0.08em]">{dict.about.skills}</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {profile.skills.map((skill) => (
              <li
                key={skill}
                className="bg-linear-to-r from-accent-from to-accent-to bg-size-[100%_1px] bg-bottom-left bg-no-repeat pb-1 text-sm font-bold md:text-base"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-6 md:grid-cols-[240px_1fr] md:gap-16">
          <h2 className="text-xl font-bold tracking-[0.08em]">{dict.about.interests}</h2>
          <ul className="space-y-3">
            {profile.interests.map((interest) => (
              <li key={interest} className="text-sm text-white/85 md:text-base">
                {interest}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
