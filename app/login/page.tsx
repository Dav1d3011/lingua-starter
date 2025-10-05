// FILEPATH: app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null); // just to display, not to edit
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u?.email) setEmail(u.email);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => { sub.subscription?.unsubscribe(); };
  }, []);

  async function signInWithGoogle() {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      // Redirect happens via OAuth; no need to do anything else here.
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setEmail(null);
    router.refresh();
  }

  if (email) {
    return (
      <main className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">You’re signed in</h1>
        <p className="mb-6 opacity-80">Signed in as <span className="font-medium">{email}</span>.</p>
        <div className="flex gap-3">
          <button
            className="border rounded-xl px-4 py-2"
            onClick={() => router.push('/dict')}
          >
            Go to Dictionary
          </button>
          <button className="border rounded-xl px-4 py-2" onClick={signOut}>
            Sign out
          </button>
        </div>
        <p className="mt-6 text-sm opacity-70">
          You can use the whole site without an account; login only saves progress.
        </p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Log in</h1>

      <button
        className="border rounded-xl px-4 py-3 w-full"
        onClick={signInWithGoogle}
        disabled={loading}
      >
        {loading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <p className="mt-6 text-sm opacity-70">
        No password forms here — we use Google only. You can also use the site without logging in; login just saves progress.
      </p>
    </main>
  );
}
