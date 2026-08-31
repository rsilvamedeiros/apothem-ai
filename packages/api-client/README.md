# @apothem/api-client

Typed client generated from `apothem-api`'s published OpenAPI spec — apothem-api is the source of truth (ADR-008); this package never hand-duplicates request/response types.

```bash
npm run sync-and-generate --workspace=packages/api-client
```

`sync` copies `openapi.json` from a sibling `../apothem-api` checkout when present (falls back to the checked-in vendored copy otherwise); `generate` runs `openapi-typescript` over it into `src/generated/schema.d.ts`. Re-run after any apothem-api contract change and commit the diff.

`src/client.ts` wraps `openapi-fetch`; `principalId` maps to the API's dev-only `x-principal-id` bootstrap header (`DevHeaderAuthenticator`) ahead of real session auth (ADR-009) — server-side only, never expose it to the browser.
