# Prompt and Context Management

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Prompts are versioned configuration artifacts. Critical system instructions should be composed from explicit layers:

1. platform safety/runtime instructions;
2. agent-version instructions;
3. relevant policy/tool descriptions;
4. selected knowledge evidence;
5. conversation/task state;
6. structured output contract.

Context engineering must prioritize relevance over simply maximizing token volume. Use retrieval, summaries and task-state compaction. Preserve separation between trusted platform instructions and untrusted user/document content.

Prompt templates should have identifiers/versions so eval regressions can be associated with a concrete change.
