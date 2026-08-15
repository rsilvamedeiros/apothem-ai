# Authentication, Authorization and RBAC

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Authentication establishes principal identity. Authorization answers whether that principal can perform a capability in tenant/resource context.

Prefer OIDC-compatible identity so authentication provider can evolve. Sessions/tokens should carry minimal identity; current membership/critical permissions are evaluated against server-side authoritative state or safely cached state.

Authorization request concept:
`principal + organization + workspace + capability + resource + attributes → allow/deny (+ obligations such as approval)`.

RBAC provides default bundles; attribute/policy checks handle contextual constraints. UI hiding is never authorization.
