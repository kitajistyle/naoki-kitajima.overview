import type { Viewport } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { AdminBottomNav } from './_dashboard/AdminBottomNav'

// Map to the same CSS variables the site's Tailwind theme resolves, so
// font-sans -> Noto Sans JP and font-mono -> Inter without touching globals.css.
const notoSans = Noto_Sans_JP({
  variable: '--font-geist-sans',
  weight: ['400', '500', '700'],
  preload: false,
})
const inter = Inter({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

export const viewport: Viewport = {
  themeColor: '#F4F5F7',
  colorScheme: 'light',
  viewportFit: 'cover',
}

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <html lang="ja" className={`${notoSans.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F4F5F7] text-[#14161A] font-sans [--background:#F4F5F7] [--foreground:#14161A]">
        <div className="min-h-screen pb-[calc(68px+env(safe-area-inset-bottom))]">{children}</div>
        <AdminBottomNav />
      </body>
    </html>
  )
}
