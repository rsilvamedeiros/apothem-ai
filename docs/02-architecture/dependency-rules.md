# Dependency Rules

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

1. Domain code cannot import delivery/framework/provider SDKs.
2. Tenant authorization occurs before repository operations that expose tenant-owned resources.
3. Cross-context calls use application services/ports or events, not direct table manipulation from unrelated modules.
4. UI does not directly call model providers or connector credentials.
5. Provider-specific response objects are normalized at adapter boundaries.
6. Background workers receive identifiers/commands, not massive opaque UI payloads.
7. Audit/usage production occurs through explicit ports and cannot be “best effort only” for privileged actions.
8. Database transactions should not remain open while waiting on long external AI/network calls.
9. External side effects are represented as stateful attempts with idempotency/correlation metadata.
10. Schema contracts for APIs/events live in a versioned contracts boundary.
