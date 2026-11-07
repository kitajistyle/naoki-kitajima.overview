import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, getDictionary } from './dictionaries'
import { Header } from '../components/ui/Header'
import { Footer } from '../components/ui/Footer'
import { getProfile } from '../../lib/data'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

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
  const { links: socialLinks } = getProfile(lang)

  const navItems = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.works, href: `/${lang}/works` },
    { label: dict.nav.about, href: `/${lang}/about` },
    { label: dict.nav.blog, href: `/${lang}/blog` },
    { label: dict.nav.like, href: `/${lang}/like` },
    { label: dict.nav.contact, href: `/${lang}/contact` },
  ]

  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col tracking-[0.02em]">
        <Header lang={lang} navItems={navItems} socialLinks={socialLinks} />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer lang={lang} navItems={navItems} socialLinks={socialLinks} />
      </body>
    </html>
  )
}
