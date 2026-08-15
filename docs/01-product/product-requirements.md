# Product Requirements Document

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Objective

Deliver an initial enterprise AI platform where an organization can configure an agent, attach permissioned knowledge and tools, interact with it, allow it to prepare or execute controlled actions, and inspect the resulting execution/audit trail.

## Primary actors

- **Organization Owner** — owns tenant setup, billing and high-level security.
- **Workspace Admin** — manages members, agents, knowledge and connections within scope.
- **Builder** — configures agents, tools and workflows.
- **Operator / Business User** — uses deployed agents and responds to approvals.
- **Auditor / Security** — reviews executions, access, policies and incidents.
- **API Client** — external software invoking APOTHEM capabilities using scoped credentials.

## MVP outcomes

A new customer must be able to:

1. create or receive access to an organization;
2. create a workspace;
3. invite users and assign roles;
4. create an agent draft;
5. define its purpose and instructions;
6. configure a model policy without coupling the business concept to one provider;
7. upload documents into a knowledge base;
8. bind that knowledge base to the agent;
9. connect at least one safe read tool and one approval-gated action tool;
10. publish an immutable agent version;
11. start a conversation/run;
12. view citations or evidence when knowledge is used;
13. see tool calls and approval requests;
14. approve/reject pending work where authorized;
15. inspect execution timeline, outcome, usage and errors.

## Functional domains

### Organization and workspace management
Tenant onboarding, workspace lifecycle, membership, role assignment, invitations and API credentials.

### Agent Studio
Create draft, edit instructions, attach knowledge/tools, configure autonomy, validate configuration, publish version, disable or archive.

### Agent runtime
Receive task, resolve effective version/context, route model, call tools, pause for approval, resume, produce output and persist execution artifacts.

### Knowledge
Create knowledge bases, upload supported documents, process/index them asynchronously, search permission-aware content, return source references and expose processing status.

### Connections and tools
Store external connection metadata, keep secrets outside normal application data, expose typed tools, configure tool permissions and action risk.

### Approvals
Generate a durable approval request for policy-gated side effects, show the exact proposed action and relevant context, enforce authorized approvers, expire/cancel appropriately, and resume execution idempotently.

### Control
Execution history, audit trail, basic usage/cost telemetry, agent health and failed job visibility.

## Product quality requirements

- Users can understand why an action is pending approval.
- Destructive actions do not execute solely because the model requested them.
- An agent version can be reconstructed after publication.
- Cross-tenant data leakage is treated as a critical defect.
- Knowledge answers retain evidence/source identity.
- Failed/retried operations do not duplicate unsafe side effects.
- Every high-risk action has an auditable actor and policy decision.

## Deferred from MVP

Visual workflow canvas, public marketplace, sophisticated billing tiers, enterprise SSO/SCIM, advanced analytics, dozens of connectors, autonomous multi-agent swarms, white-label management UI and international localization are later phases unless a design partner requires a narrow slice.

## Detailed capability requirements

### Organization / workspace lifecycle
The system must support a customer that grows from one team to several independent operational areas without cloning tenants. Organization settings therefore own company identity and global governance, while Workspace owns day-to-day agents, knowledge, tools and flows. Moving a resource between workspaces is not assumed safe because permissions, connections and knowledge bindings may change; migration should be an explicit operation later.

Invitations and membership changes are security events. A removed user must immediately lose new access even if historical runs still reference that user as actor. The platform should make it possible to suspend a workspace or organization without physically destroying data while an incident, billing issue or legal request is investigated.

### Agent Studio lifecycle
Agent editing is deliberately separated from publication. Builders need freedom to iterate without causing behavior drift in an active business process. The draft UI should continuously validate configuration: missing knowledge, invalid tool binding, revoked connection, unsupported model capability, impossible structured-output schema, or policy that will always deny the configured action.

A publish action should show a version diff/summary and create an immutable AgentVersion. For early MVP this does not require sophisticated Git-style diffs; it does require recording the effective configuration so a historic run can be reconstructed.

### Runtime / task execution
A run can originate from chat, API, future workflow node or internal scheduled operation. These entry points converge on the same runtime contract rather than implementing separate “chat agent” and “automation agent” logic.

The user-facing run should expose state quickly. The API accepts work, persists the run, schedules durable processing and returns an identifier. A client can then subscribe/stream/poll. Long provider latency or an approval wait must not hold a server request open as the only state mechanism.

### Knowledge experience
Users need confidence in what the agent knows. A Knowledge Base must show source state, last processed/synchronized time, failures and access scope. The agent builder should warn if it references a source that is failed, disabled or inaccessible.

Answers based on enterprise knowledge should expose evidence. The product does not promise every sentence has a citation, but retrieval-dependent assertions should be traceable to source evidence when the use case requires groundedness.

### Connections, tools and policies
A Connection alone grants no agent capability. It only establishes authenticated access to an external system. Tools are explicit operations on top of that connection. The product should make the difference visible: “Salesforce connected” is different from “this agent may read opportunities” and different again from “this agent may update opportunity stage when amount < X after approval”.

Tool configuration should show action risk and approval policy. Dangerous tools should have conservative defaults. Admin/builders should understand which agent versions currently depend on a connection before revoking it.

### Approvals
Approvals are actionable work items, not passive notifications. They require a clear proposed action snapshot, requester/run identity, target system/resource, reason, expiration, and authorize/reject controls. An approver should never need to reconstruct the proposal from a long chat transcript.

The approved proposal should not be silently regenerated after approval. If new information changes the payload materially, a new approval is required.

### Control and audit
Run detail is the operational truth for “what the agent did”. Audit is the security/business truth for privileged lifecycle/action events. Control surfaces should progressively aggregate this data into health, usage, cost and risk signals.

## Product assumptions to validate with design partners

1. Workspace is useful as a meaningful boundary below Organization.
2. Builders accept a version/publish workflow instead of instant-edit production agents.
3. Approval inbox can serve several initial business processes before more sophisticated policy routing is needed.
4. A narrow set of high-quality connectors/tools is more valuable than dozens of shallow integrations.
5. Customers will accept asynchronous ingestion and run state if progress is clear.
6. Evidence/citations materially increase trust for knowledge use cases.
7. Subscription + usage is commercially understandable once value is proven.

These assumptions should become interview questions and usage metrics rather than remaining permanent architecture folklore.

## Success metrics for early pilots

Product metrics:
- time from first login to first published agent;
- time from source upload to first grounded answer;
- weekly active operators/builders;
- percentage of runs reaching a useful terminal state;
- repeat usage by workflow/use case;
- approval turnaround time and rejection rate.

Technical/quality metrics:
- run failure rate by class;
- tool failure/duplicate-prevention rate;
- retrieval evaluation quality;
- cross-tenant security test pass rate (must remain 100%);
- model/provider cost per successful run;
- latency distribution by run stage.

Business metrics:
- hours/process steps reduced;
- error/rework reduction;
- process SLA improvement;
- design-partner expansion from one use case to another.

## Product risks

**Risk: platform becomes generic and abstract.** Mitigation: build around concrete end-to-end design-partner workflows.

**Risk: platform becomes a custom-project codebase.** Mitigation: reusable primitive review for every Solution and isolation of customer-specific adapters/templates.

**Risk: premature autonomy damages trust.** Mitigation: conservative approval defaults, visible evidence and strong audit.

**Risk: provider/model churn drives rewrites.** Mitigation: model gateway and capability-based policy.

**Risk: knowledge retrieval appears correct but leaks or hallucinates.** Mitigation: permission-aware retrieval, evidence, eval datasets and source health.
