type Props = {
  title: string
  lead?: string
  tone?: 'light' | 'dark'
}

export function SectionHeading({ title, lead, tone = 'light' }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
      <span className="mt-5 block h-px w-2.5 bg-linear-to-r from-accent-from to-accent-to" />
      {lead ? (
        <p className={`mt-6 text-sm leading-loose md:text-base ${tone === 'light' ? 'text-white/80' : 'text-ink/80'}`}>
          {lead}
        </p>
      ) : null}
    </div>
  )
}
