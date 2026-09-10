import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ShutterCursor } from '@/components/ShutterCursor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { logPageView } from '@/lib/tracking';
import { SiteOverridesProvider } from '@/lib/SiteOverridesContext';

// Blog and admin pull in react-markdown, remark-gfm, and the Supabase
// client — code the landing page (the entry point for almost every
// visitor) has no reason to pay for on first load.
const BlogListPage = lazy(() => import('@/pages/BlogListPage').then((m) => ({ default: m.BlogListPage })));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminPostEditorPage = lazy(() => import('@/pages/admin/AdminPostEditorPage').then((m) => ({ default: m.AdminPostEditorPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));
const AdminLeadsPage = lazy(() => import('@/pages/admin/AdminLeadsPage').then((m) => ({ default: m.AdminLeadsPage })));
const AdminQuotationsPage = lazy(() => import('@/pages/admin/AdminQuotationsPage').then((m) => ({ default: m.AdminQuotationsPage })));
const AdminQuotationEditorPage = lazy(() => import('@/pages/admin/AdminQuotationEditorPage').then((m) => ({ default: m.AdminQuotationEditorPage })));
const AdminQuotationPrintPage = lazy(() => import('@/pages/admin/AdminQuotationPrintPage').then((m) => ({ default: m.AdminQuotationPrintPage })));
const AdminAnalyticsPage = lazy(() => import('@/pages/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage })));
const AdminCampaignsPage = lazy(() => import('@/pages/admin/AdminCampaignsPage').then((m) => ({ default: m.AdminCampaignsPage })));
const AdminSiteContentPage = lazy(() => import('@/pages/admin/AdminSiteContentPage').then((m) => ({ default: m.AdminSiteContentPage })));
const AdminSiteMediaPage = lazy(() => import('@/pages/admin/AdminSiteMediaPage').then((m) => ({ default: m.AdminSiteMediaPage })));

// Logs a page view for every real navigation — skips /admin/* so the
// founder's own work in the CMS doesn't inflate "site visitor" numbers.
function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    logPageView(location.pathname);
  }, [location.pathname]);
  return null;
}

function AppRoutes() {
  const location = useLocation();
  return (
    // Keyed by path so navigating away from a route that errored (e.g. via
    // the browser back button) remounts a clean boundary instead of staying
    // stuck on the error screen.
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="new" element={<AdminPostEditorPage />} />
            <Route path="edit/:id" element={<AdminPostEditorPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="quotations" element={<AdminQuotationsPage />} />
            <Route path="quotations/new" element={<AdminQuotationEditorPage />} />
            <Route path="quotations/:id" element={<AdminQuotationEditorPage />} />
            <Route path="quotations/:id/print" element={<AdminQuotationPrintPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="campaigns" element={<AdminCampaignsPage />} />
            <Route path="site" element={<AdminSiteContentPage />} />
            <Route path="site/media" element={<AdminSiteMediaPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <SiteOverridesProvider>
      <main className="bg-ink" style={{ overflowX: 'clip' }}>
        <PageViewTracker />
        <AppRoutes />
        <WhatsAppButton />
        <ShutterCursor />
      </main>
    </SiteOverridesProvider>
  );
}
