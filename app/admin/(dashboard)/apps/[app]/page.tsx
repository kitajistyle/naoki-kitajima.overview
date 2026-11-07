import type { Metadata } from 'next'
import { AppDetailView } from '../../../_dashboard/AppDetailView'
import { baseRaw } from '../../../lib/base'

export function generateStaticParams() {
  return baseRaw().apps.map((a) => ({ app: a.name }))
}

const decode = (s: string): string => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export async function generateMetadata({ params }: PageProps<'/admin/apps/[app]'>): Promise<Metadata> {
  const { app } = await params
  return {
    title: { absolute: `${decode(app)} | アプリ ダッシュボード` },
    robots: { index: false, follow: false },
  }
}

export default async function AdminAppDetailPage({ params }: PageProps<'/admin/apps/[app]'>) {
  const { app } = await params
  return <AppDetailView name={decode(app)} />
}
