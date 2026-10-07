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
