'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '../icons'
import { ADMIN_NAV, isCurrentNav } from './nav-items'

export function AdminBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="メインメニュー"
      className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-[#E3E6EB] px-2 pt-1.5 pb-[calc(8px+env(safe-area-inset-bottom))]"
    >
      <ul className="max-w-[720px] mx-auto grid grid-cols-6 gap-0.5">
        {ADMIN_NAV.map((item) => {
          const current = isCurrentNav(pathname, item.path)
          return (
            <li key={item.path}>
              <Link
                href={`/admin${item.path}`}
                aria-current={current ? 'page' : undefined}
                className={`min-h-[52px] flex flex-col items-center justify-center gap-1 text-[11px] ${
                  current ? 'text-[#2456E8] font-bold' : 'text-[#5B6270] hover:text-[#14161A]'
                }`}
              >
                <Icon name={item.icon} size={22} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
