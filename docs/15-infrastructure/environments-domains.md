# Environments and Domains

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Production
- `apothemai.com.br` — public site
- `app.apothemai.com.br` — authenticated product
- `api.apothemai.com.br` — API
- `docs.apothemai.com.br` — docs
- `status.apothemai.com.br` — status page

## Non-production
Prefer clearly separated domains/subdomains such as `app.dev.apothemai.com.br`, `api.dev.apothemai.com.br`, and equivalent staging/preview strategy. Exact naming can be finalized with hosting provider.

Production and non-production must use separate credentials/secrets/data stores. Never copy customer production data into development by default.

Cookies/sessions should use the narrowest domain scope possible rather than `.apothemai.com.br` globally unless a documented cross-subdomain requirement exists.
