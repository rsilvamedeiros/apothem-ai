# Frontend Architecture

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

The web product is an authenticated enterprise application, distinct from the institutional site even if both use the same frontend framework/design foundations.

Use server rendering/server components where they simplify authenticated navigation/data fetching, and client components only for interactive state. Do not put business authorization exclusively in route/UI guards; API/application enforces it.

Feature modules should align with product bounded contexts: agents, knowledge, connections, approvals, runs/control, organization settings.

Share visual primitives via `packages/ui`; do not turn the design system into a repository of business feature components.

## Feature organization

Prefer feature-first application folders around domain capability rather than global folders filled with unrelated hooks/components. Example:

```text
features/agents
  api/
  components/
  forms/
  screens/
  state/
features/knowledge
features/connections
features/runs
```

Shared primitives live below UI/design packages only when behavior is truly cross-feature.

## Data fetching and mutation

The API/domain state is authoritative. Use a query/cache layer or framework server data primitives to handle remote state. After mutations, invalidate/update relevant scoped resources deliberately. Avoid copying an Agent object into a global state store and letting it diverge from server state.

## Draft editing

Agent/workflow builders are special: they need form/draft state independent from currently published version. Make unsaved state obvious, support validation and eventually autosave if it does not hide conflicts. Publishing is an explicit command with confirmation/version summary.

## Runs

Run screens combine persisted server state with live events. UI should tolerate duplicate/out-of-order live events by reconciling against sequence/state. Do not assume the browser receives every token/event exactly once.

## Authorization UX

Server returns capability information or authorization-specific errors; UI can hide/disable unavailable actions for clarity but must never infer permission solely from role names hard-coded in frontend.

## Error boundary strategy

Differentiate page/resource not found, access denied, transient API failure and feature execution failure. Agent run failure is often a domain state displayed inside the run UI, not a fatal application crash page.
