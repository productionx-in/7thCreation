import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, usernameToAuthEmail } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';
import { Logo } from '@/components/Logo';

const fieldClass =
  'w-full rounded-lg border border-[#767F83]/30 bg-transparent px-4 py-3 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none';

export function AdminLoginPage() {
  const { session, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: usernameToAuthEmail(username),
      password,
    });
    setSubmitting(false);
    // TEMP: surfacing the raw Supabase error (not just a generic message)
    // to root-cause a login failure that isn't explained by the account
    // itself — the stored password hash verifies correctly via direct SQL.
    if (signInError) setError(`${signInError.message} (status ${signInError.status ?? 'n/a'}, code ${signInError.code ?? 'n/a'})`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo className="h-10 w-10" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#767F83]">Studio sign-in</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={fieldClass}
            autoComplete="username"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            autoComplete="current-password"
          />
          {error && <p className="text-xs text-[#B6421D]">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-ink transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)',
              boxShadow: '0px 4px 12px rgba(201, 168, 76, 0.35), inset 0px 2px 6px rgba(255, 255, 255, 0.25)',
            }}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
