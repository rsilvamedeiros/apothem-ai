# Triggers, Nodes and Conditions

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Triggers may be manual/API, webhook/event, schedule/timer or later data-change events.

Conditions that can be expressed deterministically should use a typed expression/rule engine rather than an LLM. Agent classification can feed a structured value into a deterministic condition when interpretation is necessary.

Node inputs/outputs should be schema-validated. Large binary content is referenced via object/file IDs, not copied through every workflow state payload.
