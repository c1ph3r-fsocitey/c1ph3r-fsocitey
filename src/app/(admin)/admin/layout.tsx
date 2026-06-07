import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminGuard from '@/components/admin/AdminGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-surface-900">
        <AdminSidebar />
        <div className="flex-1 ml-0 md:ml-64 transition-all">
          <main className="p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}
