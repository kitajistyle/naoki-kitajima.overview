'use client'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-white text-zinc-900 hover:bg-zinc-200',
  ghost:   'text-zinc-400 hover:text-white',
  outline: 'border border-zinc-700 text-zinc-300 hover:border-zinc-400 hover:text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium tracking-wide
        rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
