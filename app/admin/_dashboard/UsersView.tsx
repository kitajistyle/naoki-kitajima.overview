'use client'

import { AppSelector } from './AppSelector'
import { MoreLink } from './MoreLink'
import { appHref } from './app-href'
import { ChurnCard } from './ChurnCard'
import { DataLimitsNote } from './DataLimitsNote'
import { EmptyState } from './EmptyState'
import { PcHeader } from './PcHeader'
import { RetentionCard } from './RetentionCard'
import { SpHeader } from './SpHeader'
import { useDashboard } from './use-dashboard'
import { PC_PAGE, SP_MAIN, SP_PAGE } from './styles'

// Churn comes from the production DB and retention from App Store Connect —
// neither depends on the period, so the period toggle is hidden here.
export function UsersView() {
  const { view } = useDashboard()
  const empty =
    view.hasChurn || view.hasRetention ? null : <EmptyState title={`${view.exitApp} のユーザーデータはまだありません`} />
  const note = view.hasChurn ? <DataLimitsNote /> : null

  return (
    <>
      <div className={PC_PAGE}>
        <PcHeader title="ユーザー" showPeriod={false} />
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-3 text-xs text-[#5B6270]">
            {view.exitApp}・無料で取れるデータだけで集計
            <MoreLink href={appHref(view.exitApp)} label="このアプリの詳細" />
          </span>
          <AppSelector />
        </div>
        {empty ?? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ChurnCard />
            <RetentionCard />
          </div>
        )}
        {note}
      </div>
      <div className={SP_PAGE}>
        <SpHeader title="ユーザー" showPeriod={false} />
        <main className={SP_MAIN}>
          <AppSelector scroll />
          <div className="flex justify-end px-1">
            <MoreLink href={appHref(view.exitApp)} label="このアプリの詳細" />
          </div>
          {empty}
          <ChurnCard />
          <RetentionCard />
          {note}
        </main>
      </div>
    </>
  )
}
