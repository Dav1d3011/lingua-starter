// FILEPATH: components/Topbar.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type UserLite = { email?: string | null };

export default function Topbar() {
  const [user, setUser] = useState<UserLite | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => { sub.subscription?.unsubscribe(); };
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
      },
    });
  }

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center">
        {/* Brand */}
        <Link href="/" className="font-bold text-lg mr-6">Lingua</Link>

        {/* Main nav — no login link here */}
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dict" className="hover:underline">Dictionary</Link>
          <Link href="/games" className="hover:underline">Games</Link>
        </nav>

        {/* Right side: single auth area */}
        <div className="ml-auto flex items-center gap-3 text-sm">
          {mounted && user ? (
            <>
              <span className="opacity-70">
                Signed in as <span className="font-medium">{user.email}</span>
              </span>
              <button className="border rounded-xl px-3 py-1" onClick={() => supabase.auth.signOut()}>
                Sign out
              </button>
            </>
          ) : (
            <button className="border rounded-xl px-3 py-1" onClick={signInWithGoogle}>
              Log in / Sign up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
