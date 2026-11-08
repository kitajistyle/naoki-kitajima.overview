'use client'

import Link from 'next/link'
import { appHref } from './app-href'
import { SortPills } from './SortPills'
import { useDashboard } from './use-dashboard'
import { CARD, vars } from './styles'

const th = 'font-medium py-2.5 px-3 border-b border-[#E3E6EB]'
const td = 'py-3.5 px-3 border-b border-[#EEF0F3]'

export function AppTablePc() {
  const { view } = useDashboard()
  const c = view.columns

  return (
    <section aria-label="アプリ一覧" className={`${CARD} pt-5 pb-2 flex flex-col gap-3`}>
      <div className="flex flex-wrap justify-between items-center gap-3 px-6">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold">アプリ一覧</h2>
          <span className="text-xs text-[#5B6270]">アプリ名を押すと、そのアプリの詳細を開きます</span>
        </div>
        <SortPills />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-[13px] tabular-nums">
          <thead>
            <tr className="text-[#5B6270] text-xs text-right">
              <th scope="col" className={`${th} text-left px-6`}>アプリ</th>
              <th scope="col" className={`${th} text-left`}>プラットフォーム</th>
              {c.dl ? <th scope="col" className={th}>ダウンロード</th> : null}
              {c.dau ? <th scope="col" className={th}>平均DAU</th> : null}
              {c.ret ? <th scope="col" className={th}>保持率（7日後・iOSのみ）</th> : null}
              {c.rev ? <th scope="col" className={th}>広告収益</th> : null}
              {c.rev ? <th scope="col" className={th}>課金収益</th> : null}
              {c.rev ? <th scope="col" className={th}>合計収益</th> : null}
              {c.delta ? <th scope="col" className={`${th} pl-3 pr-6`}>前期間比</th> : null}
            </tr>
          </thead>
          <tbody>
            {view.rows.map((r) => (
              <tr key={r.name} className="text-right hover:bg-[#F8F9FB]">
                <th scope="row" className="text-left py-3.5 px-6 border-b border-[#EEF0F3] font-medium">
                  <Link
                    href={appHref(r.name)}
                    className="flex items-center gap-3 group"
                  >
                    <span
                      className="w-9 h-9 rounded-[9px] bg-(--app-color) text-white flex items-center justify-center font-mono font-bold text-[15px]"
                      style={vars({ '--app-color': r.color })}
                    >
                      {r.initial}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-bold text-[#14161A] group-hover:text-[#2456E8] group-hover:underline">{r.name}</span>
                      <span className="text-xs text-[#5B6270]">{r.cat}</span>
                    </span>
                  </Link>
                </th>
                <td className={`${td} text-left text-[#464C57]`}>{r.plat}</td>
                {c.dl ? <td className={td}>{r.dl}</td> : null}
                {c.dau ? <td className={td}>{r.dau}</td> : null}
                {c.ret ? <td className={td}>{r.ret}</td> : null}
                {c.rev ? <td className={`${td} text-[#464C57]`}>{r.ad}</td> : null}
                {c.rev ? <td className={`${td} text-[#464C57]`}>{r.iap}</td> : null}
                {c.rev ? <td className={`${td} font-bold`}>{r.total}</td> : null}
                {c.delta ? (
                  <td className={`${td} pl-3 pr-6`}>
                    {r.hasDelta ? (
                      <span
                        className="font-bold text-(--d-color) bg-(--d-bg) px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={vars({ '--d-color': r.dColor, '--d-bg': r.dBg })}
                      >
                        {r.delta}
                      </span>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
