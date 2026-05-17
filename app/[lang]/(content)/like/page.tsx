import type { Metadata } from 'next'
import Image from 'next/image'
import { getDictionary, hasLocale } from '../../dictionaries'
import { notFound } from 'next/navigation'

export const metadata: Metadata = { title: 'Like' }

export default async function LikePage({ params }: PageProps<'/[lang]/like'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const { like } = dict

  return (
    <main className="max-w-2xl mx-auto px-6 sm:px-12 space-y-16">
      <h1 className="text-3xl font-bold">{like.heading}</h1>

      {/* Bboy section */}
      <section className="space-y-8">
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm">
          <Image
            src="/bboy.jpg"
            alt="Bboying at a cypher"
            fill
            className="object-cover object-top grayscale"
          />
          <span className="absolute bottom-4 left-4 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
            {like.cypher_label}
          </span>
        </div>

        <h2 className="text-2xl font-bold">{like.bboy_title}</h2>

        <div className="space-y-5">
          {like.bboy_paragraphs.map((paragraph, i) => (
            <p key={i} className="text-zinc-400 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </main>
  )
}
