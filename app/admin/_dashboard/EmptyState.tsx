import { CARD } from './styles'

export function EmptyState({ title = 'まだ表示できるデータがありません', children }: { title?: string; children?: React.ReactNode }) {
  return (
    <section className={`${CARD} px-6 py-10 flex flex-col items-center gap-2 text-center`}>
      <h2 className="text-[15px] font-bold text-[#464C57]">{title}</h2>
      <p className="text-xs leading-[1.7] text-[#5B6270]">
        {children ?? '各データソースから数字が届くと、ここに表示されます。'}
      </p>
    </section>
  )
}
