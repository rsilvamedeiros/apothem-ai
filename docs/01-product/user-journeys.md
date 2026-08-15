# User Journeys

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Journey A — First organization to first useful agent

1. User accepts invitation or creates organization.
2. Creates/selects workspace.
3. Creates agent draft from blank or template.
4. Defines outcome-focused purpose and instructions.
5. Creates knowledge base and uploads source documents.
6. Waits for processing status to become ready.
7. Attaches knowledge base to agent.
8. Adds tool(s) and chooses autonomy/approval policy.
9. Runs built-in test scenarios.
10. Publishes version.
11. Uses agent from chat/task surface.
12. Reviews run trace and adjusts next draft without mutating the published version.

## Journey B — Approval

1. Run proposes a side effect.
2. Runtime evaluates tool policy.
3. Execution transitions to `WAITING_APPROVAL` before side effect.
4. Approval inbox shows who/what requested the action, exact target/payload, reason, expiration and risk.
5. Approver accepts/rejects.
6. Decision is recorded immutably.
7. Runtime resumes using the same pending action identity/idempotency key.
8. Outcome is added to execution timeline.

## Journey C — Audit investigation

1. Auditor filters by organization/workspace/time/agent/user/action.
2. Opens execution.
3. Sees immutable agent version, actor, model route, retrieved sources, tools, approvals, errors and final state.
4. Can correlate audit event IDs and traces without exposing sensitive raw content unnecessarily.
