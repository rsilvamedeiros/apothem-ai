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
