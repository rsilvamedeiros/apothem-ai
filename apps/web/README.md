# apps/web

Authenticated product application (`app.apothemai.com.br`). Next.js (App Router, TypeScript), consuming `@apothem/api-client` against a running `apothem-api`.

```bash
cp .env.example .env.local     # set APOTHEM_API_URL
npm run dev --workspace=apps/web
```

Sign-in is a dev-only bootstrap (paste a principal id + organization id — see `apothem-api/database/seed.ts` for fixtures) until self-hosted OIDC lands (ADR-009). No org-listing/switcher across organizations yet: `apothem-api` has no "organizations for this principal" endpoint, only create + get-by-id, so this shell can only enter a known organization id directly.
