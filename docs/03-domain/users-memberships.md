# Users, Principals and Memberships

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Separate **identity/principal** from **organization membership**. One user can join multiple tenants with different roles.

Principal types may include human user, service account/API client and later machine identity. Authorization operates on principal + organization/workspace + capability + resource attributes.

Invitation lifecycle: created → delivered → accepted/expired/revoked. Membership removal invalidates future authorization but does not rewrite historical audit actor identity.

Future enterprise SSO can map external identity groups to memberships without changing tenant-owned resource models.
