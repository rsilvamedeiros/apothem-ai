# MVP Acceptance Criteria

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

The MVP is acceptable when an internal/design-partner organization can complete the following without database edits or developer intervention:

- create workspace and invite another member;
- configure and publish an agent version;
- upload supported documents and observe ingestion state;
- ask an agent a question whose answer includes evidence from permitted documents;
- use a read-only tool;
- request a side-effecting tool that generates an approval instead of executing;
- approve that action as an authorized user and observe exactly-once logical execution;
- reject an action and confirm no side effect occurs;
- inspect run timeline, tool arguments/result metadata, approval and final state;
- prove a user from another tenant cannot access the workspace/resource through UI or direct API identifiers;
- disable a connection/agent and observe new runs fail safely;
- attribute AI usage to the correct tenant/workspace/run.

A demo that only streams a model response does not meet MVP acceptance.
