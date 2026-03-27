import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      xp: number;
      level: number;
      streak: number;
    };
  }

  interface User {
    id: string;
    xp: number;
    level: number;
    streak: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    xp: number;
    level: number;
    streak: number;
  }
}
