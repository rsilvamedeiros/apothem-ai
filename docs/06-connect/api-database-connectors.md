# API and Database Connectors

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## REST/API connector
Prefer predefined or customer-configured typed operations over arbitrary URL access. Validate host allowlists, auth, method, path templates, input schemas, timeout and response-size limits to reduce SSRF/data-exfiltration risk.

## Database connector
Do not expose generic unrestricted SQL as a default agent tool. Safer forms include approved read views, parameterized query templates or application-specific operations. Write access should be extremely constrained and approval/policy aware.

Connection pools/credentials remain tenant-scoped. Query/tool results are size-limited and sanitized before entering model context.
