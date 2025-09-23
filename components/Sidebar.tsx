'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { featureRegistry } from '@/core/registry';
import '@/features/register.client';
import { supabase } from '@/lib/supabaseClient';

type UserLite = { email?: string | null };

export default function Sidebar() {
  const [items, setItems] = useState(() => featureRegistry.all());
  const [user, setUser] = useState<UserLite | null>(null);

  useEffect(() => {
    setItems(featureRegistry.all());

    // get current user once
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    // and listen for changes
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => { sub.subscription?.unsubscribe(); };
  }, []);

  return (
    <aside className="p-4 border-r min-h-screen flex flex-col">
      <div className="font-bold text-lg mb-4">Lingua</div>

      {/* Auth chip */}
      <div className="mb-4 text-sm">
        {user ? (
          <div className="space-y-2">
            <div className="opacity-70">
              Signed in as<br /><span className="font-semibold">{user.email}</span>
            </div>
            <button className="border rounded-xl px-3 py-1"
                    onClick={() => supabase.auth.signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="opacity-70">Not signed in</div>
            <Link className="border rounded-xl px-3 py-1 inline-block" href="/login">
              Log in / Sign up
            </Link>
          </div>
        )}
      </div>

      <nav className="space-y-2">
        {items.map(f => (
          <Link key={f.id} href={f.route} className="block hover:underline">
            {f.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto text-xs opacity-60 pt-4">
        All features work without an account. Login only saves your progress.
      </div>
    </aside>
  );
}
