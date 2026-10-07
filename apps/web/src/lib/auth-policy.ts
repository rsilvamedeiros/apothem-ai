/**
 * Who may sign in to apps/web (ADR-012). Pure functions, no framework
 * imports, so the rules are unit-tested and Auth.js only calls them.
 */

/** Providers that assert email ownership with `email_verified`. */
const TRUSTED_PROVIDERS = new Set(["google"]);

export function parseAllowlist(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}

/**
 * Empty list means open registration. Entries are exact emails or `@domain`
 * (exact domain: subdomains and lookalike domains do not match). Use it to
 * keep a pre-launch environment closed.
 */
export function isEmailAllowed(email: string, allowlist: readonly string[]): boolean {
  if (allowlist.length === 0) return true;
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0 || at === normalized.length - 1) return false;
  const domain = normalized.slice(at);
  return allowlist.some((entry) => (entry.startsWith("@") ? entry === domain : entry === normalized));
}

type SignInInput = {
  account?: { provider?: string | undefined } | null;
  profile?: { email?: unknown; email_verified?: unknown } | null;
};

/** Only a verified email from a trusted provider, and inside the allowlist, may sign in. */
export function shouldAllowSignIn(input: SignInInput, allowlist: readonly string[]): boolean {
  const provider = input.account?.provider;
  if (!provider || !TRUSTED_PROVIDERS.has(provider)) return false;
  const email = input.profile?.email;
  if (typeof email !== "string" || email.length === 0) return false;
  if (input.profile?.email_verified !== true) return false;
  return isEmailAllowed(email, allowlist);
}
