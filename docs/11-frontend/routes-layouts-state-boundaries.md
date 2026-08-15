# Routes, Layouts and State Boundaries

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Suggested product route model:

```text
/o/:orgSlug
  /w/:workspaceSlug
    /overview
    /agents
    /agents/:agentId
    /knowledge
    /connections
    /flows
    /approvals
    /runs
    /settings
```

Organization/workspace selection is persistent navigation context, but server authorization verifies every resource.

Remote server data should use server/query-cache semantics rather than global client state duplication. Local UI state remains local. Streaming run state may use a dedicated subscription/event abstraction while persisted run status stays authoritative.
