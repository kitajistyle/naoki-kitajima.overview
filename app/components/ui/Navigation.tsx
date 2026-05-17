'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LangSwitch } from './LangSwitch'

type NavItem = {
  label: string
  href: string
}

type Props = {
  lang: string
  items: NavItem[]
}

export function Navigation({ lang, items }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const switchTo = (target: string) =>
    pathname.replace(`/${lang}`, `/${target}`)

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-10 text-xs font-medium tracking-[0.2em] text-zinc-400">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-white transition-colors duration-300"
          >
            {item.label.toUpperCase()}
          </Link>
        ))}
        <LangSwitch lang={lang} switchTo={switchTo} />
      </nav>

      {/* Mobile: controls */}
      <div className="sm:hidden flex items-center gap-6 z-50">
        <LangSwitch lang={lang} switchTo={switchTo} />
        <button
          className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 relative"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={open}
        >
          <span className={`block w-6 h-px bg-white transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile: overlay menu */}
      <div
        className={`sm:hidden fixed inset-0 bg-[#050814]/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-10 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-2xl font-medium tracking-[0.2em] text-zinc-300 hover:text-white transition-colors duration-300"
            onClick={() => setOpen(false)}
          >
            {item.label.toUpperCase()}
          </Link>
        ))}
      </div>
    </>
  )
}
