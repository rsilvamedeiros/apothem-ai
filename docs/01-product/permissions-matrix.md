# Initial Permission Matrix

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Roles are a product abstraction and should eventually be customizable; the initial matrix provides a safe default.

| Capability | Owner | Admin | Builder | Operator | Auditor |
|---|---:|---:|---:|---:|---:|
| Organization settings | ✓ | limited | — | — | read |
| Billing | ✓ | — | — | — | read metadata |
| Workspace membership | ✓ | ✓ | — | — | read |
| Create/edit agent draft | ✓ | ✓ | ✓ | — | read |
| Publish agent | ✓ | ✓ | configurable | — | read |
| Manage knowledge | ✓ | ✓ | ✓ | use | read metadata |
| Manage connections | ✓ | ✓ | configurable | — | read metadata |
| Run agent | ✓ | ✓ | ✓ | ✓ | optional |
| Approve actions | policy | policy | policy | policy | — |
| Manage workspace tool policy | ✓ | ✓ | — | — | read |
| View executions | ✓ | ✓ | ✓ | own/scoped | ✓ |
| View audit | ✓ | ✓ | limited | own | ✓ |
| API keys | ✓ | ✓ | scoped | — | metadata |

Permissions must be capabilities/scopes internally, even if roles provide bundled defaults.

## Implementation notes

- The backend resolves conditional cells ("limited", "configurable", "policy", "scoped", "own") conservatively: a capability is granted by default only where the matrix shows an unconditional check. Conditional behavior is added later through attribute/policy checks, not by widening the bundle.
- The default bundles are enforced by a golden test in `apothem-api` (`permission-matrix.test.ts`). Changing this table requires changing that test in the same commit.
- Workspace-level roles override only workspace capabilities, never organization settings or billing.
- `approval.decide` is granted by default to owner and admin only. The matrix cell "policy" is resolved conservatively: authoring (builder) and running (operator) are separate duties from deciding, and a requester needs another approver unless they are the only one.
