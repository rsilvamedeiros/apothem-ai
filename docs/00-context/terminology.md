# Terminology

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Core terms

**Organization** — top-level customer/tenant boundary for billing, identity and data ownership.

**Workspace** — operational partition inside an organization. Used to group agents, knowledge, connections and workflows with separate membership/scopes where useful.

**Agent** — logical configured AI worker. It has identity, purpose and one or more immutable versions.

**Agent Version** — immutable executable configuration snapshot: instructions, model policy, tool bindings, knowledge bindings, guardrails and relevant settings.

**Run / Execution** — durable instance of an agent or workflow performing work.

**Conversation** — user-facing thread that can produce one or more agent runs. Conversation is not the execution record itself.

**Knowledge Base** — permissioned collection of knowledge sources and indexed content.

**Knowledge Source** — origin such as an uploaded file, Drive folder, database view or external content source.

**Connection** — authenticated integration with an external system.

**Tool** — typed operation an agent/workflow can invoke through a connection or internal capability.

**Tool Binding** — permissioned relationship that allows an agent/workflow to use a tool with configured scope.

**Flow / Workflow** — durable graph/state-machine orchestration of triggers, deterministic steps, agent steps, conditions, approvals and actions.

**Approval** — explicit request for a human/authorized actor to allow a pending side effect or workflow transition.

**Policy** — machine-enforced business/security rule that constrains access or action.

**Audit Event** — immutable security/business record describing who/what did something, to which resource, under which tenant context, and with what result.
