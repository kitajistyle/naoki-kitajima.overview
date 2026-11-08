import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { notFound } from 'next/navigation'
import { getProfile } from '../../../../lib/data'
import { PageHeader } from '../../../components/ui/PageHeader'
import { SocialIcon } from '../../../components/ui/SocialIcon'
import { ArrowCircle } from '../../../components/ui/ArrowCircle'

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'SNS' : 'Contact',
    description: isJa
      ? 'きたじー（KITAJI）へのSNS。'
      : 'Get in touch with Kitaji (きたじー).',
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { en: '/en/contact', ja: '/ja/contact', 'x-default': '/en/contact' },
    },
  }
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const { links } = getProfile(lang)

  return (
    <main>
      <PageHeader title="Contact" sub={dict.nav.contact} lead={dict.contact.lead} />
      <ul className="mx-auto max-w-300 px-8 md:px-16">
        {links.map((link) => (
          <li key={link.url} className="border-b border-white/10 first:border-t">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 py-6 md:py-8"
            >
              <span className="flex items-center gap-4 text-xl font-bold tracking-[0.08em] md:text-3xl">
                <SocialIcon label={link.label} className="text-lg text-white/60 md:text-2xl" />
                {link.label}
              </span>
              <ArrowCircle />
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
