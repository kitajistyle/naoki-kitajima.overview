'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LangSwitch } from './LangSwitch'
import { SocialIcon } from './SocialIcon'

type NavItem = {
  label: string
  href: string
}

type Props = {
  lang: string
  navItems: NavItem[]
  socialLinks: { label: string; url: string }[]
}

const underline =
  'bg-linear-to-r from-accent-from to-accent-to bg-size-[0%_1px] bg-bottom-left bg-no-repeat py-1 transition-[background-size] duration-200 hover:bg-size-[100%_1px]'

export function Header({ lang, navItems, socialLinks }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the menu when navigating — adjust state during render
  // instead of in an effect to avoid a cascading re-render
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      {/* mix-blend-difference keeps the header legible over video, dark and white sections alike */}
      <header className="pointer-events-none fixed inset-x-0 top-2 z-50 flex items-center justify-between px-8 text-white mix-blend-difference md:top-8 md:px-[max(64px,calc(50%-600px))]">
        <Link
          href={`/${lang}`}
          className="pointer-events-auto h-12 font-mono text-lg leading-12 font-bold tracking-[0.3em]"
        >
          KITAJI
        </Link>
        <div className="pointer-events-auto flex items-center gap-6">
          <div className="hidden sm:block">
            <LangSwitch lang={lang} />
          </div>
          <button
            type="button"
            className="relative -mr-2.5 size-12"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            <span
              className={`absolute left-2.5 h-0.5 w-7 bg-white transition-all duration-200 ${open ? 'top-5.5 rotate-45' : 'top-4'}`}
            />
            <span
              className={`absolute left-2.5 h-0.5 w-7 bg-white transition-all duration-200 ${open ? 'top-5.5 -rotate-45' : 'top-7'}`}
            />
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-ink-deep pt-20 text-white transition-opacity duration-400 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <nav
          className={`flex flex-1 flex-col items-center justify-center overflow-y-auto transition-transform duration-400 ${open ? 'translate-y-0' : 'translate-y-10'}`}
        >
          <ul className="flex flex-col items-center gap-8 text-xl font-bold tracking-[0.12em] md:text-3xl">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={underline}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="mt-9 mb-9 h-px w-2.5 bg-linear-to-r from-accent-from to-accent-to" />
          <ul className="flex flex-col items-center gap-6 text-base">
            {socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${underline}`}
                >
                  <SocialIcon label={link.label} className="text-sm opacity-70" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={`flex justify-end px-8 pb-10 transition-transform duration-400 md:px-16 ${open ? 'translate-y-0' : 'translate-y-10'}`}
        >
          <LangSwitch lang={lang} />
        </div>
      </div>
    </>
  )
}
