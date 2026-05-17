import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import { getWorks } from '../../../lib/data'
import { notFound } from 'next/navigation'

export const metadata: Metadata = { title: 'Works' }

export default async function WorksPage({ params }: PageProps<'/[lang]/works'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const works = getWorks(lang)

  return (
    <main>
      <h1>{dict.nav.works}</h1>
    </main>
  )
}
