import Link from 'next/link'
import { LangSwitch } from './LangSwitch'
import { SocialIcon } from './SocialIcon'

type LinkItem = {
  label: string
  href: string
}

type Props = {
  lang: string
  navItems: LinkItem[]
  socialLinks: { label: string; url: string }[]
}

export function Footer({ lang, navItems, socialLinks }: Props) {
  return (
    <footer className="bg-ink-deep px-8 py-15 text-white md:px-16">
      <div className="mx-auto max-w-300">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href={`/${lang}`} className="font-mono text-lg font-bold tracking-[0.3em]">
              KITAJI
            </Link>
            <ul className="mt-9 flex flex-col gap-6 text-sm font-bold tracking-[0.12em] md:flex-row md:gap-10">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="bg-linear-to-r from-accent-from to-accent-to bg-size-[0%_1px] bg-bottom-left bg-no-repeat py-1 transition-[background-size] duration-200 hover:bg-size-[100%_1px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <LangSwitch lang={lang} />
        </div>

        <div className="mt-6 h-px bg-linear-to-r from-accent-from to-accent-to" />

        <div className="mt-8 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex gap-4 text-[10px] font-bold tracking-[0.12em] text-muted">
            <span>© {new Date().getFullYear()} KITAJI</span>
            <Link href={`/${lang}/privacy`} className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </p>
          <ul className="-mx-2.5 flex">
            {socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex size-10 items-center justify-center transition-opacity duration-300 hover:opacity-60"
                >
                  <SocialIcon label={link.label} className="text-lg" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
