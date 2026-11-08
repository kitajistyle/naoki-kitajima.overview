'use client'

import { AppCardSp } from './AppCardSp'
import { AppTablePc } from './AppTablePc'
import { PcHeader } from './PcHeader'
import { SortPills } from './SortPills'
import { SpHeader } from './SpHeader'
import { useDashboard } from './use-dashboard'
import { PC_PAGE, SP_MAIN, SP_PAGE } from './styles'

export function AppsView() {
  const { view } = useDashboard()

  return (
    <>
      <div className={PC_PAGE}>
        <PcHeader title="アプリ別" />
        <AppTablePc />
      </div>
      <div className={SP_PAGE}>
        <SpHeader title="アプリ別" />
        <main className={SP_MAIN}>
          <div className="flex flex-col gap-2 px-1">
            <span className="text-xs text-[#5B6270]">{view.cards.length}件・タップで詳細を開く</span>
            <SortPills />
          </div>
          <ul className="flex flex-col gap-2.5">
            {view.cards.map((a) => (
              <li key={a.name}>
                <AppCardSp app={a} />
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  )
}
