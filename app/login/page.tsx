'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null); const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setLoading(true);
    try {
      const fn = mode === 'in'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
      const { error } = await fn; if (error) throw error;
      setMsg(mode === 'in' ? 'Signed in!' : 'Account created & signed in!');
    } catch (err: any) { setMsg(err.message ?? 'Something went wrong'); }
    finally { setLoading(false); }
  }

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">{mode === 'in' ? 'Log in' : 'Create account'}</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded-xl px-3 py-2" placeholder="Email"
               type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded-xl px-3 py-2" placeholder="Password"
               type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full border rounded-xl px-3 py-2">
          {loading ? 'Please wait…' : (mode === 'in' ? 'Log in' : 'Sign up')}
        </button>
      </form>
      <div className="text-sm mt-3">
        {mode === 'in'
          ? <button className="underline" onClick={()=>setMode('up')}>Create an account</button>
          : <button className="underline" onClick={()=>setMode('in')}>I already have an account</button>}
      </div>
      {msg && <div className="mt-3 text-sm">{msg}</div>}
      <p className="text-xs opacity-70 mt-4">
        You can use the whole site even without an account. Login only saves progress.
      </p>
    </main>
  );
}
