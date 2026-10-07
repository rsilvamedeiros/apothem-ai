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
