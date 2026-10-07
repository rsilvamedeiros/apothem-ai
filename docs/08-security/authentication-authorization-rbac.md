# Authentication, Authorization and RBAC

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Authentication establishes principal identity. Authorization answers whether that principal can perform a capability in tenant/resource context.

Prefer OIDC-compatible identity so authentication provider can evolve. Sessions/tokens should carry minimal identity; current membership/critical permissions are evaluated against server-side authoritative state or safely cached state.

Authorization request concept:
`principal + organization + workspace + capability + resource + attributes → allow/deny (+ obligations such as approval)`.

RBAC provides default bundles; attribute/policy checks handle contextual constraints. UI hiding is never authorization.

## Implemented rules (apothem-api)

- Capabilities are the only unit authorization checks are made against; roles are default bundles. The bundles are locked by a golden test against the permission matrix, so a role cannot be widened by accident.
- Deny by default: an unknown capability, or an unknown or forged role name (including inherited object keys such as `toString`), is denied. It must never throw or fall through to allow.
- A workspace-level role override applies to workspace capabilities only. `organization.*` capabilities always use the organization role, so a workspace membership can never escalate to organization settings or billing.
- Only `active` memberships and `active` workspaces resolve a tenant context. `invited`, `revoked` and `archived` states are denied.
- A denied tenant resolution returns the same error whether the workspace does not exist or belongs to another organization (no existence leak).
- `approval.decide` is not part of any default bundle; it is evaluated by policy (ADR-007).
- Granting roles is bounded by the actor's own organization role (role assignment policy): only owners can create or change owners and admins; admins can manage builder, operator and auditor only. This is enforced in the API and covered by property tests; the UI never decides it.

## Authentication (implemented in apothem-api, ADR-012)

- Deployed environments accept only signed bearer tokens (`AUTH_MODE=jwt`); the API refuses to boot in production with the dev header authenticator. In `jwt` mode the `x-principal-id` header is ignored even if present.
- Verification is strict and fails closed with a generic 401: signature, required `exp` and `sub`, issuer, audience, an explicit algorithm allow list (no `alg: none`, no algorithm confusion) and a 5 second clock tolerance.
- A token maps to an existing, active principal by provider-verified email, case-insensitively. Suspended accounts stop working immediately because the principal is checked on every request. Unknown accounts are not auto-provisioned.
- Tokens carry identity only. Tenant scope and permissions always come from server-side membership.
- The web app keeps the credential in an `httpOnly`, `sameSite=lax` cookie (`secure` in production) with a bounded lifetime and calls the API from the server.