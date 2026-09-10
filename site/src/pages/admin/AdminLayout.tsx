import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/useAuth';
import { Logo } from '@/components/Logo';

export function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return (
    <div className="min-h-screen bg-ink">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#767F83]/15 px-5 py-4 print:hidden sm:px-8">
        <Link to="/admin" className="flex items-center gap-3">
          <Logo className="h-7 w-7" />
          <span className="font-display text-sm uppercase tracking-[0.3em] text-[#E6DECD]">Studio</span>
        </Link>
        <div className="flex flex-wrap items-center gap-5 text-xs uppercase tracking-widest text-[#767F83]">
          <Link to="/admin" className="hover:text-[#E6DECD]">Posts</Link>
          <Link to="/admin/site" className="hover:text-[#E6DECD]">Site</Link>
          <Link to="/admin/leads" className="hover:text-[#E6DECD]">Leads</Link>
          <Link to="/admin/quotations" className="hover:text-[#E6DECD]">Quotations</Link>
          <Link to="/admin/campaigns" className="hover:text-[#E6DECD]">Campaigns</Link>
          <Link to="/admin/analytics" className="hover:text-[#E6DECD]">Analytics</Link>
          <Link to="/admin/settings" className="hover:text-[#E6DECD]">Settings</Link>
          <Link to="/" className="hover:text-[#E6DECD]">View site</Link>
          <button onClick={() => signOut()} className="hover:text-[#E6DECD]">Sign out</button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-10 print:max-w-none print:p-0 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}
