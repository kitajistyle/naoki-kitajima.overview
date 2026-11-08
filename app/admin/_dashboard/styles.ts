import type { CSSProperties } from 'react'

export const vars = (o: Record<`--${string}`, string>): CSSProperties => o as CSSProperties

const pillBase = 'min-h-9 px-3 rounded-full text-xs font-bold cursor-pointer border flex items-center gap-1.5'
export const PILL_ON = `${pillBase} bg-[#14161A] text-white border-[#14161A]`
export const PILL_OFF = `${pillBase} bg-white text-[#464C57] border-[#D5D9E0]`

export const CARD = 'bg-white border border-[#E3E6EB] rounded-[14px]'

export const SOURCE_TAG =
  'text-[11px] font-bold text-[#464C57] bg-[#F4F5F7] border border-[#E3E6EB] px-2 py-[3px] rounded-md whitespace-nowrap'

// Both layouts are mounted; CSS picks one by breakpoint
export const PC_PAGE = 'hidden md:flex flex-col gap-6 pt-8 px-10 pb-12 max-w-[1240px] mx-auto'
export const SP_PAGE = 'md:hidden w-full max-w-[520px] mx-auto'
export const SP_MAIN = 'p-4 flex flex-col gap-4'
