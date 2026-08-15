# Agent Autonomy Levels

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Autonomy is not a single global switch. It is evaluated by action/tool/policy.

### Level 0 — Read
Agent can only retrieve and analyze authorized information.

### Level 1 — Recommend
Agent can produce recommendations/structured proposals but no pending side-effect object.

### Level 2 — Prepare
Agent may construct a concrete action payload/draft, but execution is impossible from this level.

### Level 3 — Approval required
Agent can request execution of a side effect; runtime pauses until authorized human approval.

### Level 4 — Bounded autonomous
A specific tool/action may execute automatically inside configured scopes, limits and policies.

A single agent may operate at multiple levels: read customer data autonomously, prepare an email, require approval to send, and be completely denied from deleting records.

Risk policy may inspect amount, destination, data classification, resource type, time, actor, tool and contextual attributes before choosing allow/approval/deny.
