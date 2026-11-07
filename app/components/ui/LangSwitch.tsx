'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const YEAR = 60 * 60 * 24 * 365
const LOCALES = [
  { code: 'ja', label: 'JP' },
  { code: 'en', label: 'EN' },
] as const

const setLocaleCookie = (locale: string): void => {
  document.cookie = `locale=${locale}; path=/; max-age=${YEAR}; SameSite=Lax`
}

type Props = {
  lang: string
}

export function LangSwitch({ lang }: Props) {
  const pathname = usePathname()

  return (
    <div className="flex items-center text-[13px] tracking-widest">
      {LOCALES.map((locale, i) => (
        <span key={locale.code} className="flex items-center">
          {i > 0 ? <span className="px-3 opacity-50">/</span> : null}
          {locale.code === lang ? (
            <span className="border-b border-current pb-1.5 font-bold" aria-current="true">
              {locale.label}
            </span>
          ) : (
            <Link
              href={pathname.replace(`/${lang}`, `/${locale.code}`)}
              onClick={() => setLocaleCookie(locale.code)}
              className="pb-1.5 opacity-50 transition-opacity hover:opacity-100"
            >
              {locale.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
