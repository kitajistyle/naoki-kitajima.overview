import { notFound } from 'next/navigation'
import { hasLocale, getDictionary } from './dictionaries'
import { Header } from '../components/ui/Header'
import { Footer } from '../components/ui/Footer'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ja' }]
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  const navItems = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.about, href: `/${lang}/about` },
    { label: dict.nav.blog, href: `/${lang}/blog` },
    { label: dict.nav.like, href: `/${lang}/like` },
    { label: dict.nav.contact, href: `/${lang}/contact` },
  ]

  return (
    <>
      <Header lang={lang} navItems={navItems} />
      <div className="pt-16 flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </>
  )
}
