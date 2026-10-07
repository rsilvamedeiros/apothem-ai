# Model Gateway and Routing

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Gateway contract
Normalize core operations such as text/structured generation, tool-capable response, embeddings (if kept in same package), usage and error classes.

## Model policy
Agent configuration should express preferences/requirements rather than hard-wire a vendor name where possible:
- capability: tool calling, structured output, vision, long context;
- quality tier;
- latency tier;
- data residency/privacy requirement;
- maximum cost/credits;
- allowed/disallowed providers;
- fallback behavior.

## Routing
Router evaluates policy plus live provider availability/rate limits and selects an approved model. Record selected provider/model/version metadata on the run.

## Fallback
Fallback is allowed only when semantics permit it. Do not retry a completed side-effecting reasoning step against another model without considering duplicate actions. Provider errors should be normalized into transient/rate_limit/auth/invalid_request/safety/unavailable classes.

## Implemented guardrails (apothem-api)

- Provider allow/deny lists (deny wins, an empty allowlist matches nothing), required capabilities (all must be present) and a minimum quality tier are enforced by the router.
- `maxCostPerRunUsd` is enforced against a conservative worst-case cost (estimated input plus the full output cap). A route without configured pricing never satisfies a budget (fail closed) and an invalid budget matches nothing. Provider prices are not hard-coded; they are added to the route catalog deliberately.
- No automatic fallback exists yet, which is equivalent to `fallbackAllowed: false`. Fallback is designed together with runs because of duplicate side-effect risk.
- Routing behavior is covered by a dataset-driven eval (`apothem-api/src/modules/models/evals`). Provider adapters are tested through injected fake clients; only the mock adapter runs in CI.
