# Initial ERD

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

```mermaid
erDiagram
  ORGANIZATION ||--o{ WORKSPACE : owns
  ORGANIZATION ||--o{ MEMBERSHIP : has
  WORKSPACE ||--o{ AGENT : contains
  AGENT ||--o{ AGENT_VERSION : versions
  WORKSPACE ||--o{ KNOWLEDGE_BASE : contains
  KNOWLEDGE_BASE ||--o{ KNOWLEDGE_SOURCE : contains
  KNOWLEDGE_SOURCE ||--o{ KNOWLEDGE_ITEM : produces
  KNOWLEDGE_ITEM ||--o{ KNOWLEDGE_CHUNK : splits
  WORKSPACE ||--o{ CONNECTION : contains
  CONNECTION ||--o{ TOOL_BINDING : enables
  AGENT_VERSION ||--o{ AGENT_TOOL_BINDING : allows
  AGENT_VERSION ||--o{ AGENT_KNOWLEDGE_BINDING : uses
  AGENT_VERSION ||--o{ RUN : executes
  RUN ||--o{ TOOL_EXECUTION : invokes
  RUN ||--o{ APPROVAL : requests
  WORKSPACE ||--o{ WORKFLOW : contains
  WORKFLOW ||--o{ WORKFLOW_VERSION : versions
  WORKFLOW_VERSION ||--o{ WORKFLOW_EXECUTION : executes
```

This is conceptual. Physical table normalization and polymorphic bindings should be chosen during migrations while preserving these ownership relationships.
