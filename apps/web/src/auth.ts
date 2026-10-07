import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { parseAllowlist, shouldAllowSignIn } from "@/lib/auth-policy";

declare module "next-auth" {
  interface Session {
    /** Provider-verified email flag, copied from the sign-in profile. */
    emailVerified?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    emailVerified?: boolean;
  }
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

/** Sign-in is offered only when the provider credentials exist (AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET). */
export const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

/**
 * Self-hosted Auth.js (ADR-009/ADR-012): the session lives in an encrypted
 * httpOnly cookie, no database. The browser session is NOT the API credential;
 * server code exchanges it for a short-lived signed bearer token per request
 * (see lib/session.ts). The cookie secret is separate from the token secret.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: googleConfigured ? [Google] : [],
  secret: process.env.APOTHEM_SESSION_SECRET,
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/", error: "/" },
  callbacks: {
    signIn({ account, profile }) {
      return shouldAllowSignIn({ account, profile }, parseAllowlist(process.env.APOTHEM_SIGNUP_ALLOWLIST));
    },
    jwt({ token, profile }) {
      if (profile) token.emailVerified = profile.email_verified === true;
      return token;
    },
    session({ session, token }) {
      session.emailVerified = token.emailVerified === true;
      return session;
    },
  },
});
