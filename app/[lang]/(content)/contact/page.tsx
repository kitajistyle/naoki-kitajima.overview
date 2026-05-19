import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { notFound } from 'next/navigation'
import { ContactScene } from '../../../components/ui/ContactScene'

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'お問い合わせ' : 'Contact',
    description: isJa
      ? '北島直樹（きたじー / KITAJI）へのお問い合わせ。'
      : 'Get in touch with Naoki Kitajima (KITAJI).',
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { en: '/en/contact', ja: '/ja/contact' },
    },
  }
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <main>
      <ContactScene title={dict.nav.contact} />
    </main>
  )
}
