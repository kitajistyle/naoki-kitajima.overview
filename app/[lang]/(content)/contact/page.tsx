import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { notFound } from 'next/navigation'
import { Scene } from '../../../components/ui/Scene'

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
  const { lang } = await params
  const isJa = lang === 'ja'
  return {
    title: isJa ? 'SNS' : 'Contact',
    description: isJa
      ? 'きたじー（KITAJI）へのSNS。'
      : 'Get in touch with Naoki Kitajima (KITAJI).',
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

  return (
    <>
      <Scene name="contact" />
      <main className="relative z-10 px-6 sm:px-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight mb-12">{dict.nav.contact}</h1>
        </div>
      </main>
    </>
  )
}
