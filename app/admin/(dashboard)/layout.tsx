import { DashboardProvider } from '../_dashboard/DashboardProvider'
import { getAdminRaw } from '../lib/aggregate'

// Regenerate at most once an hour — external API calls and page renders only
// happen on revalidation, not per request. Session check still runs per
// request in proxy.ts.
export const revalidate = 3600

// Data is fetched once here; the provider keeps period / sort / selected app
// while moving between the dashboard pages.
export default async function DashboardLayout({ children }: LayoutProps<'/admin'>) {
  const raw = await getAdminRaw()
  return <DashboardProvider raw={raw}>{children}</DashboardProvider>
}
