# ADR-015 — Workspace Tool Policy, v1

**Status:** Accepted
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

## Context

[ADR-013](013-tools-and-approvals-v1.md) lets a person who publishes an agent decide, per tool, whether it runs automatically or asks first. That choice is made agent by agent. An owner or admin who is accountable for a whole workspace has no way to say "nobody here may use this tool" or "this tool must always ask a person", whatever each agent's author chose. ADR-013 reserved this as future work that "slots into the policy step".

## Decision

1. **A workspace policy is a ceiling, not a grant.** It can only make a tool stricter than an agent binding; it can never enable a tool, add a binding or lower an approval requirement. Bindings still decide what an agent may use.
2. **Two rules per tool, absence means no rule.** `blocked`: the tool cannot run in any agent of the workspace. `approval_required`: every use asks a person first, even if the binding says `auto` and even for a read-only tool. A tool without a rule behaves exactly as ADR-013 says.
3. **Evaluated at run time, from the server.** The runtime loads the workspace rules when a run starts and applies them in the policy step. Blocked tools are not even offered to the model. A model proposal for a blocked tool fails the run with the new stable code `TOOL_BLOCKED_BY_POLICY`, records a failed step without the arguments, and runs nothing. Changing a rule affects the next run and the next resume; published agent versions are not rewritten.
4. **Work already waiting is protected too.** An approval created before a tool was blocked is invalidated through the existing path (conditions re-checked before anything runs, ADR-013): the decision is closed with the reason `the tool is blocked by a workspace policy`, the run ends with `APPROVAL_INVALIDATED` and nothing is performed; a person can still reject it. As a second line, resuming a run re-checks the rule and ends with `TOOL_BLOCKED_BY_POLICY` without executing.
5. **Deny wins.** The order is: unbound, then blocked, then require approval (rule, binding or risk), then allow. A rule never relaxes a decision that another input already made stricter.
6. **Who may change it.** A new capability, `policy.manage`, granted by default to `owner` and `admin` only, the same people who can decide approvals. Reading the rules needs `agent.read`, so authors can see why a tool is unavailable. The workspace comes from the authenticated context, never from the payload, and the tool name must exist in the catalog.
7. **Audited.** Setting or removing a rule is audited with the tool name, the rule and the previous rule (never free text). Setting the same rule twice is a no-op and is not audited again.
8. **Fail closed.** If the rules cannot be loaded, the run fails with `RUN_INTERNAL_ERROR` rather than running without them.

## Consequences

- One table (`tool_policies`, unique per workspace and tool) and migration `0006`. No change to agent versions or bindings.
- The golden permission matrix and `01-product/permissions-matrix.md` gain `policy.manage`.
- The run error taxonomy gains `TOOL_BLOCKED_BY_POLICY`, with fixed user-facing guidance in the web app.
- The web app shows the rules in workspace settings and marks affected tools on the agent page, so an author is not surprised at run time.
- Organization-wide rules, per-role thresholds, spend limits and per-argument conditions remain future work and fit the same policy step.

## Alternatives

- **Validate at publish time only:** rejected; a policy tightened after publishing would not protect anything already live.
- **Let a rule enable a tool for every agent:** rejected; it would be a grant, and grants belong in explicit bindings made by the person who publishes.
- **Reuse `approval.decide` for managing rules:** rejected; deciding one proposal and changing the rules for every agent are different duties that should be grantable separately later.
- **Store the rule inside each agent version:** rejected; it would be frozen at publish time and could not tighten live agents.
