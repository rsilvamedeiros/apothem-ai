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
