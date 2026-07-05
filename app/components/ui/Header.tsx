'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Navigation } from './Navigation'

type NavItem = {
  label: string
  href: string
}

type Props = {
  lang: string
  navItems: NavItem[]
}

export function Header({ lang, navItems }: Props) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Scroll down -> hide
      if (currentScrollY > lastScrollY.current && currentScrollY > 64) {
        setIsVisible(false)
      }
      // Scroll up -> show
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 h-16 bg-transparent transition-[top] duration-300 ${
        isVisible ? 'top-0' : '-top-16'
      }`}
    >
      <Link
        href={`/${lang}`}
        className="text-sm font-medium tracking-[0.25em] text-white hover:opacity-60 transition-opacity"
      >
        NK
      </Link>
      <Navigation lang={lang} items={navItems} />
    </header>
  )
}
