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
