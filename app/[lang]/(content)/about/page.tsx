import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../dictionaries'
import { getProfile } from '../../../../lib/data'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'プロフィール' : 'About',
    description: isJa
      ? '北島直樹（きたじー / KITAJI）のプロフィール。東京理科大学理学部物理学科卒、ソフトウェアエンジニア / SRE。Bboy。'
      : 'Profile of Naoki Kitajima (KITAJI) — Software Engineer / SRE. Physics graduate from Tokyo University of Science. Bboy.',
    keywords: isJa
      ? ['北島直樹', 'きたじー', 'KITAJI', 'プロフィール', 'ソフトウェアエンジニア', 'SRE', '経歴']
      : ['Naoki Kitajima', 'KITAJI', 'About', 'Software Engineer', 'SRE', 'Profile'],
    alternates: {
      canonical: `/${lang}/about`,
      languages: { en: '/en/about', ja: '/ja/about' },
    },
  }
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const profile = getProfile(lang)

  return (
    <main className="max-w-2xl mx-auto px-6 sm:px-12 space-y-12">
      <section>
        <h1 className="text-3xl font-bold">{profile.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{profile.role} · {profile.location}</p>
        <p className="mt-4 leading-relaxed">{profile.bio}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">{dict.about.skills}</h2>
        <ul className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <li key={skill} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">{dict.about.career}</h2>
        <ul className="space-y-3">
          {profile.career.map((item) => (
            <li key={item.org} className="flex justify-between text-sm">
              <span>{item.org}</span>
              <span className="text-gray-500">{item.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">{dict.about.interests}</h2>
        <ul className="flex flex-wrap gap-4">
          {profile.interests.map((interest) => (
            <li key={interest} className="text-sm text-gray-600">{interest}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">{dict.about.links}</h2>
        <ul className="flex flex-wrap gap-4">
          {profile.links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-2 hover:opacity-60 transition-opacity"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
