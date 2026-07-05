export function Footer({ fixed = false }: { fixed?: boolean }) {
  return (
    <footer className={`${fixed ? 'fixed bottom-0 left-0 right-0 z-30' : ''} px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 bg-transparent`}>
      <p>© {new Date().getFullYear()} Naoki Kitajima</p>
    </footer>
  )
}
