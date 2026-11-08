import type { Work } from '../../../lib/data'
import { WorkCard } from './WorkCard'

type Props = {
  works: Work[]
  lang: string
  viewDetailLabel: string
  headingLevel?: 'h2' | 'h3'
}

// Alternating wide/narrow rows of two, echoing an editorial grid
const rowColumns = ['md:grid-cols-[720fr_450fr]', 'md:grid-cols-[450fr_720fr]']

export function WorksGrid({ works, lang, viewDetailLabel, headingLevel = 'h3' }: Props) {
  const rows: Work[][] = []
  for (let i = 0; i < works.length; i += 2) rows.push(works.slice(i, i + 2))

  return (
    <ul className="flex flex-col gap-5 md:gap-7.5">
      {rows.map((row, i) => (
        <li key={row[0].slug}>
          <ul
            className={`grid gap-5 md:h-[min(calc(38vw-83.6px),450px)] md:gap-7.5 ${row.length > 1 ? rowColumns[i % 2] : ''}`}
          >
            {row.map((work) => (
              <li key={work.slug} className="h-full">
                <WorkCard work={work} lang={lang} viewDetailLabel={viewDetailLabel} headingLevel={headingLevel} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
