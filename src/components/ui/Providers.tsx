'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        {children}
        <ThemedToaster />
      </ThemeProvider>
    </SessionProvider>
  );
}

/** Separate component so it re-renders when theme changes */
function ThemedToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        className: '',
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: '500',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
        success: {
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--card))',
          },
        },
        error: {
          iconTheme: {
            primary: '#f87171',
            secondary: 'hsl(var(--card))',
          },
        },
      }}
    />
  );
}

