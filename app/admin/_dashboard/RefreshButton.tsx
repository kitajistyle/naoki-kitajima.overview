'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '../icons'

const MIN_SPIN_MS = 600
const DONE_MS = 2000

// Re-fetches the server data with visible feedback: spinning while pending,
// then a check mark for a moment so the tap is clearly acknowledged.
export function RefreshButton({ withLabel = false }: { withLabel?: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (doneTimer.current) clearTimeout(doneTimer.current)
    },
    []
  )

  const onClick = () => {
    if (doneTimer.current) clearTimeout(doneTimer.current)
    setDone(false)
    startTransition(async () => {
      router.refresh()
      await new Promise((r) => setTimeout(r, MIN_SPIN_MS))
      setDone(true)
      doneTimer.current = setTimeout(() => setDone(false), DONE_MS)
    })
  }

  const label = isPending ? '更新中…' : done ? '更新しました' : 'データを更新'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      aria-label={label}
      aria-busy={isPending}
      className={`h-11 ${withLabel ? 'px-3.5 gap-2' : 'w-11'} rounded-xl border flex items-center justify-center text-[13px] font-bold transition-colors cursor-pointer disabled:cursor-wait ${
        done ? 'border-[#B7E4CC] bg-[#E3F5EC] text-[#0B6B4B]' : 'border-[#E3E6EB] bg-white text-[#14161A] hover:bg-[#F4F5F7]'
      }`}
    >
      <span className={`flex ${isPending ? 'animate-spin' : ''}`}>
        <Icon name={done ? 'check' : 'refresh'} size={withLabel ? 16 : 20} />
      </span>
      {withLabel ? <span aria-live="polite">{label}</span> : <span className="sr-only" aria-live="polite">{label}</span>}
    </button>
  )
}
