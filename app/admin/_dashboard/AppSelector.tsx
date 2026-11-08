'use client'

import { useDashboard } from './use-dashboard'
import { PILL_OFF, PILL_ON, vars } from './styles'

export function AppSelector({ scroll = false }: { scroll?: boolean }) {
  const { view, appIndex, setAppIndex } = useDashboard()

  return (
    <div
      role="group"
      aria-label="アプリを選ぶ"
      className={`flex gap-1.5 ${scroll ? 'overflow-x-auto pb-0.5' : 'flex-wrap'}`}
    >
      {view.appOptions.map((o, i) => {
        const on = i === appIndex
        return (
          <button
            key={o.name}
            type="button"
            aria-pressed={on}
            onClick={() => setAppIndex(i)}
            className={`${on ? PILL_ON : PILL_OFF} shrink-0`}
          >
            <span className="w-2 h-2 rounded-full bg-(--app-color)" style={vars({ '--app-color': o.color })} />
            {o.name}
          </button>
        )
      })}
    </div>
  )
}
