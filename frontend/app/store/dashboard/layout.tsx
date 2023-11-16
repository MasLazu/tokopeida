import Sidebar from "@/components/dashboard/sidebar"

export default function StoreDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-72" />
      <main className="flex-grow">{children}</main>
    </div>
  )
}
