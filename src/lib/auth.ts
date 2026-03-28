import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from '@/lib/db';
import { levelFromXP } from '@/lib/utils';

// User model is imported dynamically to avoid circular deps at auth init time
async function getUserModel() {
  const { default: User } = await import('@/models/User');
  return User;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    // Fires on every sign-in — creates user record on first Google login
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return false;

      try {
        await connectDB();
        const User = await getUserModel();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email || "no-reply@unknown.com",
            name: user.name || "Anonymous User",
            image: user.image || "",
            xp: 0,
            streak: 0,
            lastActiveDate: null,
          });
        }

        return true;
      } catch (error) {
        console.error('[AUTH] signIn callback error:', error);
        return false;
      }
    },

    // Attaches DB user fields (id, xp, streak) to the JWT token
    async jwt({ token, user: _user }) {
      try {
        await connectDB();
        const User = await getUserModel();

        const dbUser = (await User.findOne({ email: token.email }).lean()) as {
          _id: { toString(): string };
          xp: number;
          streak: number;
        } | null;

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.xp = dbUser.xp ?? 0;
          token.level = levelFromXP(dbUser.xp ?? 0);
          token.streak = dbUser.streak ?? 0;
        }
      } catch (error) {
        console.error('[AUTH] jwt callback error:', error);
      }

      return token;
    },

    // Exposes token fields on the client-side session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.xp = token.xp;
        session.user.level = token.level;
        session.user.streak = token.streak;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
};
