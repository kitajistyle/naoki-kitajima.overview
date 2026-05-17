import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { notFound } from 'next/navigation'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <main>
      <h1>{dict.nav.contact}</h1>
    </main>
  )
}
