import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../../dictionaries'
import { notFound } from 'next/navigation'
import Image from 'next/image'

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
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 py-12">
      <h1 className="text-3xl md:text-5xl font-bold mb-16 tracking-wider">{dict.nav.contact}</h1>
      
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
        {/* Earth (not rotating) */}
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72">
          <Image 
            src="/hero.png" 
            alt="Earth" 
            fill 
            sizes="(max-width: 640px) 14rem, 18rem"
            className="object-contain" 
            priority 
          />
        </div>
        
        {/* Social Links revolving */}
        <div className="absolute inset-0 animate-[spin_20s_linear_infinite] pointer-events-none">
          {/* GitHub */}
          <a
            href="https://github.com/kitajistyle"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground hover:text-gray-400 transition-colors pointer-events-auto flex flex-col items-center gap-2 group animate-[spin_20s_linear_infinite_reverse]"
            aria-label="GitHub Profile"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/kitajistyle"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-foreground hover:text-gray-400 transition-colors pointer-events-auto flex flex-col items-center gap-2 group animate-[spin_20s_linear_infinite_reverse]"
            aria-label="X (Twitter) Profile"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* Zenn */}
          <a
            href="https://zenn.dev/kitajistyle"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-foreground hover:text-gray-400 transition-colors pointer-events-auto flex flex-col items-center gap-2 group animate-[spin_20s_linear_infinite_reverse]"
            aria-label="Zenn Profile"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg">
              <path d="M3.197 0h17.606v2.179L6.502 21.82H20.8v2.18H3.197v-2.18L17.498 2.18H3.197V0z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/kitajistyle"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-foreground hover:text-gray-400 transition-colors pointer-events-auto flex flex-col items-center gap-2 group animate-[spin_20s_linear_infinite_reverse]"
            aria-label="LinkedIn Profile"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </main>
  )
}

