import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

const ADMIN_EMAILS = ['c1ph3r.fsocitey@gmail.com', 'rahulthegreat2001@gmail.com']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    redirect('/admin-login')
  }

  return (
    <div className="flex min-h-screen bg-surface-900">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 transition-all">
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
