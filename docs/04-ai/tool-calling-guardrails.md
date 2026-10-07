# Tool Calling and Guardrails

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

A model can **propose** a tool invocation; the runtime decides whether it is valid and permitted.

Pipeline:
`model proposal → schema validation → resource/scope enrichment → policy evaluation → approval decision → execution → normalized result → audit`.

Guardrails include:
- allowed tool list from AgentVersion;
- binding-specific scopes;
- argument schema/semantic validation;
- deny lists and data classification;
- monetary/volume thresholds;
- rate/concurrency limits;
- human approval;
- maximum tool calls per run;
- output/result sanitization before re-entering model context.

Tool output is untrusted external input. Protect the next reasoning turn from prompt injection embedded in tool/document content.

## Implemented in apothem-api (ADR-013)

- The catalog is code with strict argument schemas and a risk level per tool. Agent versions bind tools explicitly (`toolBindings`), validated at publish time; the model is only shown bound tools, described by name, purpose and argument schema.
- The runtime evaluates policy in code: unbound is denied, irreversible always requires approval, a reversible write requires approval unless its binding says `auto`, and anything unknown fails closed to a human.
- A run is capped at 3 tool calls. Tool output is bounded (2000 characters), serialized as data, labelled untrusted and kept in a user-role message so it cannot override the agent's instructions.
- Approvals are durable and immutable; the person who started the run cannot approve it while another approver exists; they expire after 24 hours; approval resumes the persisted proposal with an idempotency key derived from the approval id. See `docs/adr/013-tools-and-approvals-v1.md`.
