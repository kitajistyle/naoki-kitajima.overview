import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from '../../dictionaries'
import { getPrivacyPolicy } from '../../../../lib/data'
import { PageHeader } from '../../../components/ui/PageHeader'

export async function generateMetadata({ params }: PageProps<'/[lang]/privacy'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'プライバシーポリシー' : 'Privacy Policy',
    description: isJa
      ? 'kitajistyle.com のプライバシーポリシー。'
      : 'Privacy policy of kitajistyle.com.',
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { en: '/en/privacy', ja: '/ja/privacy', 'x-default': '/en/privacy' },
    },
  }
}

export default async function PrivacyPage({ params }: PageProps<'/[lang]/privacy'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const policy = getPrivacyPolicy(lang)
  const isJa = lang === 'ja'

  return (
    <main>
      <PageHeader title="Privacy Policy" sub={isJa ? 'プライバシーポリシー' : undefined} lead={policy.lead} />
      <div className="mx-auto max-w-300 px-8 md:px-16">
        <div className="max-w-2xl">
          {policy.sections.map((section) => (
            <section key={section.heading} className="border-t border-white/10 py-8 md:py-10">
              <h2 className="text-lg font-bold tracking-[0.04em] md:text-xl">{section.heading}</h2>
              <p className="mt-4 text-sm leading-loose text-white/80 md:text-base">{section.body}</p>
            </section>
          ))}
          <p className="border-t border-white/10 pt-8 text-sm md:text-base">
            <a
              href={`mailto:${policy.contact}`}
              className="font-bold underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
            >
              {policy.contact}
            </a>
          </p>
          <p className="mt-6 text-xs text-white/50">
            {isJa ? '最終更新日：' : 'Last updated: '}
            {policy.updated}
          </p>
        </div>
      </div>
    </main>
  )
}
