"use client";

import { signIn } from 'next-auth/react';

// Metadata is now removed because this is a client component ('use client').
// We could move it to a layout.tsx, but for a simple login page this is fine.

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950">
      <div className="w-full max-w-md px-8 py-10 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl text-center">
        {/* Logo / Brand */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Life<span className="text-indigo-400">OS</span>
          </h1>
          <p className="mt-2 text-indigo-200 text-sm">
            Your gamified productivity dashboard
          </p>
        </div>

        {/* Sign-in button — wired fully in Phase 1 Task 8 */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          id="google-signin-btn"
          className="flex items-center justify-center gap-3 w-full py-3 px-5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors rounded-xl text-white font-semibold shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-5 text-xs text-indigo-300/60">
          By signing in you agree to our{' '}
          <span className="underline cursor-pointer">Terms of Service</span>.
        </p>
      </div>
    </main>
  );
}
