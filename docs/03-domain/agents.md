# Agents and Versions

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Agent
Long-lived identity representing a business role/capability. Mutable metadata includes name, description, status and current draft pointer.

## Agent Draft
Editable configuration under construction. May be tested using an explicit snapshot so test results remain reproducible.

## Agent Version
Immutable publication snapshot containing:
- instructions/system behavior;
- model policy;
- knowledge bindings;
- tool bindings and policy references;
- memory policy;
- structured-output expectations;
- guardrail/evaluation configuration;
- version metadata/checksum.

Publishing creates a new version; it never edits the previous one. Runs always record version ID.

Agent status may be draft/active/disabled/archived. Disabling blocks new production runs while preserving history.

## Enforced invariants (implemented in apothem-api)

- Agents belong to one workspace; lookups are always scoped by workspace, so an agent of another workspace is indistinguishable from a missing one.
- Publishing snapshots the draft into an immutable version. The checksum is a SHA-256 over canonical JSON (sorted keys), so equal configurations hash equally regardless of key order.
- `archived` is terminal: no draft edits, no publish and no status change.
- Disabling or archiving, publishing and draft edits each emit an audit event; denied operations emit none.
- The version store has no update or delete operation.
