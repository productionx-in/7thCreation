import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

const fieldClass =
  'w-full max-w-sm rounded-lg border border-[#767F83]/30 bg-transparent px-4 py-2.5 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none';

export function AdminSettingsPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setStatus('error');
      setMessage('Password should be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setStatus('error');
      setMessage("Passwords don't match.");
      return;
    }
    setStatus('saving');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('done');
      setMessage('Password updated.');
      setPassword('');
      setConfirm('');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-[#E6DECD]">Settings</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm flex-col gap-4">
        <p className="text-xs uppercase tracking-widest text-[#767F83]">Change password</p>
        <input
          required
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass}
        />
        <input
          required
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={fieldClass}
        />
        {message && (
          <p className={`text-xs ${status === 'error' ? 'text-[#B6421D]' : 'text-[#C6A15B]'}`}>{message}</p>
        )}
        <button
          type="submit"
          disabled={status === 'saving'}
          className="inline-flex w-fit items-center justify-center rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-ink disabled:opacity-60"
          style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
        >
          {status === 'saving' ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
