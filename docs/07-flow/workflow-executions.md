# Workflow Executions

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

WorkflowExecution references immutable WorkflowVersion and tracks node attempts, variables/state, approvals, timestamps, errors and final output.

Suggested states: `QUEUED`, `RUNNING`, `WAITING`, `WAITING_APPROVAL`, `COMPLETED`, `FAILED`, `CANCELLED`.

Cancellation is a command with authorization and audit. It does not retroactively undo completed external side effects. Compensation, where supported, is modeled explicitly.
