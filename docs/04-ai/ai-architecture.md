# AI Architecture

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

APOTHEM separates the product concept of an agent from provider-specific LLM APIs.

```mermaid
flowchart LR
  RUN[Run Runtime] --> CE[Context Engine]
  CE --> MR[Model Router]
  MR --> GW[Model Gateway]
  GW --> OAI[OpenAI adapter]
  GW --> ANT[Anthropic adapter]
  GW --> GOO[Google adapter]
  RUN --> TR[Tool Runtime]
  RUN --> RET[Knowledge Retrieval]
  RUN --> POL[Policy / Guardrails]
  RUN --> MEM[Memory]
  RUN --> EVT[Trace / Evals / Usage]
```

The application asks for capabilities/policies; adapters normalize provider message formats, tool calls, structured outputs, usage and errors.

Reasoning loops must have explicit limits: max turns/tool calls/time/cost. The runtime should terminate predictably rather than allowing an unbounded agent loop.
