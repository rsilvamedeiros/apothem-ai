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
| View executions | ✓ | ✓ | ✓ | own/scoped | ✓ |
| View audit | ✓ | ✓ | limited | own | ✓ |
| API keys | ✓ | ✓ | scoped | — | metadata |

Permissions must be capabilities/scopes internally, even if roles provide bundled defaults.
