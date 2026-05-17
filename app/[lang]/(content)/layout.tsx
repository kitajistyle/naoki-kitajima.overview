import { Footer } from '../../components/ui/Footer'

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-1 py-8 sm:py-14">{children}</div>
      <Footer />
    </>
  )
}
