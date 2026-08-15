# Functional Requirements

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Requirements use `FR-*` identifiers so backlog and tests can reference them.

### Identity and tenancy
- **FR-ID-001** An authenticated user can belong to multiple organizations.
- **FR-ID-002** An organization can contain multiple workspaces.
- **FR-ID-003** Membership and role are evaluated server-side.
- **FR-ID-004** Workspace access can be narrower than organization membership.

### Agents
- **FR-AG-001** Agent configuration starts as a mutable draft.
- **FR-AG-002** Publishing creates an immutable version.
- **FR-AG-003** A run references exactly one effective published version (or an explicit test draft snapshot).
- **FR-AG-004** Agent can bind knowledge bases and tools with scoped configuration.
- **FR-AG-005** Agent can be disabled without deleting historical runs.

### Knowledge
- **FR-KN-001** Upload creates a source and asynchronous processing job.
- **FR-KN-002** Processing exposes status and actionable errors.
- **FR-KN-003** Retrieval enforces tenant/workspace/knowledge permissions before returning chunks.
- **FR-KN-004** Search results retain source/chunk metadata for citation.

### Tools and approvals
- **FR-TL-001** Tool arguments are validated against a schema.
- **FR-TL-002** Tool policies can deny, allow or require approval.
- **FR-TL-003** Side-effect retries must be idempotency-aware.
- **FR-AP-001** Approval contains immutable proposed-action snapshot.
- **FR-AP-002** Only authorized approvers can decide.
- **FR-AP-003** Decision cannot be changed after finalization; corrective action is a new event/process.

### Executions
- **FR-EX-001** Long-running runs are durable and resumable.
- **FR-EX-002** Runs record state transitions.
- **FR-EX-003** Failure stores a stable error classification separate from raw vendor errors.
- **FR-EX-004** Usage/cost metadata is attributable to organization/workspace/agent/run.
