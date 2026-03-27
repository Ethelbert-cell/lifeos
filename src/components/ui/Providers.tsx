'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1b4b',
            color: '#e0e7ff',
            border: '1px solid #4f46e5',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '500',
          },
          success: {
            iconTheme: { primary: '#818cf8', secondary: '#1e1b4b' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#1e1b4b' },
          },
        }}
      />
    </SessionProvider>
  );
}
