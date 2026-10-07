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

## Approvals in apothem-api (v1)

An approval is a durable record of one tool proposal (tool, validated arguments, run, requester, expiry) with a single decision: approved, rejected or expired. Deciding needs `approval.decide` (owner and admin by default), the requester cannot decide their own request while another eligible approver exists, and approving executes the persisted proposal once. Details in `adr/013-tools-and-approvals-v1.md`.
