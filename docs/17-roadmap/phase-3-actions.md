# Phase 3 — Connections, Tools and Approvals

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Deliver connection model/secrets abstraction, one design-partner-relevant connector, typed read/action tools, policy engine and human approval.

Exit criteria:
- model cannot invoke an unbound tool;
- action proposal validates schema;
- approval pauses durable run;
- unauthorized approver denied;
- approved action is logically exactly-once/idempotent;
- rejected action has no side effect;
- full trace/audit visible.
