type Props = {
  className?: string
}

// Circular arrow used by "View More" style links. The gradient disc scales in
// when an ancestor with the `group` class is hovered or focused.
export function ArrowCircle({ className = '' }: Props) {
  return (
    <span className={`relative inline-block size-15 shrink-0 md:size-17.5 ${className}`} aria-hidden="true">
      <span className="absolute inset-0 scale-0 rounded-full bg-linear-to-r from-accent-from to-accent-to transition-transform duration-200 group-hover:scale-100 group-focus-visible:scale-100" />
      <svg viewBox="0 0 70 70" fill="none" className="relative size-full">
        <circle cx="35" cy="35" r="34.5" stroke="currentColor" strokeOpacity="0.35" />
        <path
          d="M29 35h12m0 0-4.5-4.5M41 35l-4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-200 group-hover:stroke-white"
        />
      </svg>
    </span>
  )
}
