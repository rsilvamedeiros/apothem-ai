# Tenant Isolation

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Tenant isolation is enforced in multiple layers:

1. authenticated request resolves accessible organization/workspace;
2. application services pass tenant context explicitly;
3. repositories require tenant scope for tenant-owned queries;
4. database constraints/indexes include tenant ownership where appropriate;
5. cache/object/vector keys and prefixes are tenant-qualified;
6. jobs/events include tenant context;
7. observability avoids mixing sensitive cross-tenant data.

Consider database Row Level Security as an additional defense once the persistence model is concrete; do not rely on RLS as a substitute for application authorization.

Automated tests must attempt horizontal privilege escalation with valid IDs from another tenant.
