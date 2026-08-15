# Agent Lifecycle

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Lifecycle: create draft → configure → test → evaluate → publish immutable version → deploy/use → observe → create next draft → publish replacement → disable/archive.

Testing a draft should produce a snapshot/hash so a successful test maps to what was tested. Production runs default to published versions.

Version rollback means changing the active version pointer/deployment configuration, not editing the newer version out of history.

Agent templates may pre-populate drafts, but the resulting agent belongs to the customer and captures its own version lineage.
