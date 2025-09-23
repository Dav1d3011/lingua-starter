'use client';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
  };

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <button onClick={signInWithGoogle} className="w-full border rounded-xl px-3 py-2">
        Continue with Google
      </button>
      <p className="text-xs opacity-70 mt-3">
        You can use the whole site without an account. Logging in just saves your progress.
      </p>
    </main>
  );
}
