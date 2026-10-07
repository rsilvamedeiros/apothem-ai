# Organizations and Workspaces

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

**Organization** is the tenant/customer boundary. It owns billing identity, global policies, members and one or more workspaces.

**Workspace** is the default operational boundary for agents, knowledge, connections and workflows. It supports teams/use cases without forcing each customer to create separate tenants.

Key fields conceptually:
- organization: id, name, slug, status, region/data policy, created_at;
- workspace: id, organization_id, name, slug, status, settings;
- membership: principal_id, organization_id, role/capabilities, status;
- workspace membership/scope: membership_id, workspace_id, role/capabilities.

Tenant deletion is a controlled lifecycle with retention/export checks, not a cascade-delete convenience function.

## Enforced invariants (implemented in apothem-api)

- The creator of an organization becomes its active `owner`; organization and membership creation are audited. Creation is not yet atomic across the two writes (tracked as a known limitation before onboarding real customers).
- Organization slugs are globally unique (409 on conflict); workspace slugs are unique per organization.
- Workspace creation requires `workspace.membership.manage`; workspace lookups are always scoped by organization.

## Membership management (implemented in apothem-api)

- Endpoints under `/v1/organizations/{organizationId}/members`: list, add by email of an existing active account, change role, revoke. Listing needs `workspace.membership.read`; everything else needs `workspace.membership.manage` (owner and admin).
- Holding the capability is not enough: the actor's **organization** role bounds which roles they may grant, change or revoke. Owners can manage every role; admins only builder, operator and auditor. An admin can therefore never promote themselves or anyone else to admin or owner, and cannot touch an owner or a peer admin. A workspace role never widens this.
- An organization always keeps at least one active owner: the last owner cannot be demoted or revoked. Revoked and invited owners do not count.
- Revoking keeps the row for history and takes effect immediately; adding a previously revoked account reactivates the same membership with the new role.
- An unknown and a suspended account produce the same `404` so the answer reveals nothing extra. A membership id of another organization is indistinguishable from a missing one.
- Audit events: `membership.created`, `membership.reactivated`, `membership.role_changed` (from and to) and `membership.revoked`.
- Not built yet: email invitations for accounts that do not exist, workspace-level membership management and self-service leave.
