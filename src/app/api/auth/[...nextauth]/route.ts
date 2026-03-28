import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// NextAuth creates all the routes for us:
// GET /api/auth/signin
// GET /api/auth/session
// POST /api/auth/signin/google
// etc.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
