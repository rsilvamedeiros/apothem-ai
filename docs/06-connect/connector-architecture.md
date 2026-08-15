# Connector Architecture

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Connectors translate external systems into APOTHEM concepts: connection/authentication, resources, tools/actions, synchronization and webhooks.

A connector package should declare capabilities and versions. Example capabilities: `crm.read_customer`, `crm.update_opportunity`, `storage.search_files`.

Connector execution happens server-side/worker-side. UI receives safe metadata and OAuth initiation/status but never reusable secrets.

A connector can expose many tool definitions; an AgentVersion only receives explicitly bound tools/scopes.

## Connector contract

A connector definition should eventually describe:
- identifier/version/vendor;
- authentication method and requested scopes;
- connection health check;
- tools and schemas;
- read/write risk metadata;
- optional source synchronization capabilities;
- optional webhook subscriptions;
- rate-limit characteristics;
- data classification hints;
- executor implementation.

## Tool executor isolation

The agent/model never receives raw tokens. Runtime passes a validated tool request plus connection reference to the executor. The executor obtains secret material using server identity, calls the external system, normalizes/redacts the result and returns it to the runtime.

For high-risk/untrusted connectors, execution may later run in isolated networking/runtime environments. The API should not assume all connectors execute in-process forever.

## Connector versioning

External APIs change. Tool Definition version should be able to evolve without changing a historic AgentVersion. Breaking schema changes require a new tool version/binding migration. Runtime should make deprecated connector/tool status visible before it becomes an outage.

## Failure semantics

Normalize failures to auth_expired, permission_denied, rate_limited, invalid_request, not_found, conflict, timeout, unavailable and unknown. A connector error can degrade the Connection and alert admins when persistent.

## First connector selection

Choose the first production connector based on the first design-partner workflow, not brand popularity. Prefer an API with clear OAuth/service credentials, meaningful read + approval-gated action and test/sandbox support so it exercises the complete architecture.
