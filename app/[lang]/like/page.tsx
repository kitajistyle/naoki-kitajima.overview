import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import { notFound } from 'next/navigation'

export const metadata: Metadata = { title: 'Like' }

export default async function LikePage({ params }: PageProps<'/[lang]/like'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <main>
      <h1>{dict.nav.like}</h1>
    </main>
  )
}
