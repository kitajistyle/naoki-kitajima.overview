'use client'

import { usePathname } from 'next/navigation'

// Work detail pages (/[lang]/works/[slug]) fill the viewport with the work itself,
// so the site footer is left out there.
const WORK_DETAIL_PATH = /^\/[^/]+\/works\/[^/]+\/?$/

export function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return WORK_DETAIL_PATH.test(pathname) ? null : children
}
