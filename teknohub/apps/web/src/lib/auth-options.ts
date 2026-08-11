import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
  }
}

/** Supabase anon client — verifikasi login email/password (RLS aman) */
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** In-memory brute-force guard: email → timestamps login attempt (5/menit) */
const loginAttempts = new Map<string, number[]>();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // ponytail: in-memory rate limit — cukup untuk single-instance dev;
        // ganti ke Upstash/Redis kalau deploy multi-instance (Vercel).
        const now = Date.now();
        const windowMs = 60_000;
        const attempts = loginAttempts.get(credentials.email) ?? [];
        const recent = attempts.filter((t) => now - t < windowMs);
        if (recent.length >= 5) return null; // brute-force block (silent, 429 via redirect)
        recent.push(now);
        loginAttempts.set(credentials.email, recent);
        const { data, error } = await anonClient().auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });
        if (error || !data.user) return null;
        const { user } = data;
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.user_metadata?.username ?? user.email?.split("@")[0] ?? undefined,
          image: user.user_metadata?.avatar_url ?? undefined,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
