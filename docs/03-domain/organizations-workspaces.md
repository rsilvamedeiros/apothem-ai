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
