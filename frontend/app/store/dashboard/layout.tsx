import Sidebar from "@/components/dashboard/sidebar"
import PageTransition from "@/components/page-pransition"

export default function StoreDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-72" />
      <div className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  )
}
