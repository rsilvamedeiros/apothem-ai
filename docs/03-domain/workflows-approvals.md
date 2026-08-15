# Workflows and Approvals

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Workflow is a logical automation identity; WorkflowVersion is the immutable executable graph/state-machine.

Approval belongs to a pending action/transition and contains:
- requested_by principal/run;
- organization/workspace;
- policy/tool/action identity;
- exact proposal snapshot;
- reason/context summary;
- authorized approver criteria;
- status and expiration;
- final decision actor/time/comment.

Statuses: `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED`, `CANCELLED`. Approved does not necessarily mean external execution succeeded; that subsequent attempt has its own state.
