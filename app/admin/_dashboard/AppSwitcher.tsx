'use client'

import Link from 'next/link'
import { appHref } from './app-href'
import { useDashboard } from './use-dashboard'
import { PILL_OFF, PILL_ON, vars } from './styles'

// Pills linking to each app's detail page
export function AppSwitcher({ current, scroll = false }: { current: string; scroll?: boolean }) {
  const { view } = useDashboard()

  return (
    <nav aria-label="アプリを切り替え" className={`flex gap-1.5 ${scroll ? 'overflow-x-auto pb-0.5' : 'flex-wrap'}`}>
      {view.appOptions.map((o) => {
        const on = o.name === current
        return (
          <Link
            key={o.name}
            href={appHref(o.name)}
            aria-current={on ? 'page' : undefined}
            className={`${on ? PILL_ON : PILL_OFF} shrink-0`}
          >
            <span className="w-2 h-2 rounded-full bg-(--app-color)" style={vars({ '--app-color': o.color })} />
            {o.name}
          </Link>
        )
      })}
    </nav>
  )
}
