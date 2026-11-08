type Props = {
  title: string
  sub?: string
  lead?: string
}

export function PageHeader({ title, sub, lead }: Props) {
  return (
    <header className="mx-auto max-w-300 px-8 pt-36 pb-14 md:px-16 md:pt-48 md:pb-20">
      {sub && sub !== title ? (
        <p className="text-xs font-bold tracking-[0.2em] text-muted">{sub}</p>
      ) : null}
      <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-7xl">{title}</h1>
      <span className="mt-8 block h-px w-2.5 bg-linear-to-r from-accent-from to-accent-to" />
      {lead ? <p className="mt-8 max-w-2xl text-sm leading-loose text-white/80 md:text-base">{lead}</p> : null}
    </header>
  )
}
