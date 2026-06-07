import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin-login')

  // Use service client to bypass RLS when checking admin role
  const serviceClient = createServiceClient()
  const { data: adminUser } = await serviceClient
    .from('admin_users')
    .select('role')
    .eq('email', user.email)
    .single()

  if (!adminUser) redirect('/admin-login')

  return (
    <div className="flex min-h-screen bg-surface-900">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 transition-all">
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
