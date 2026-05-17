'use client'

import Link from 'next/link'

const YEAR = 60 * 60 * 24 * 365

type Props = {
  lang: string
  switchTo: (target: string) => string
}

export function LangSwitch({ lang, switchTo }: Props) {
  const setLocaleCookie = (locale: string): void => {
    document.cookie = `locale=${locale}; path=/; max-age=${YEAR}; SameSite=Lax`
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium tracking-widest">
      <Link
        href={switchTo('ja')}
        onClick={() => setLocaleCookie('ja')}
        className={lang === 'ja' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 transition-colors'}
      >
        JA
      </Link>
      <span className="text-zinc-700">/</span>
      <Link
        href={switchTo('en')}
        onClick={() => setLocaleCookie('en')}
        className={lang === 'en' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 transition-colors'}
      >
        EN
      </Link>
    </div>
  )
}
