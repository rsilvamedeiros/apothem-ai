# MCP, Webhooks and Connector SDK

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## MCP
Model Context Protocol can provide interoperability with tool servers, but APOTHEM policy remains authoritative. An MCP-advertised tool is discovered capability, not automatically trusted/authorized capability.

Before invocation, wrap MCP tools in the same schema validation, binding, policy, audit and timeout model as native tools.

## Webhooks
Inbound webhooks authenticate/signature-verify, deduplicate and enqueue processing. Outbound webhooks are signed, retried with backoff, have delivery logs and stable event IDs.

## Connector SDK direction
A future SDK should let connector authors define metadata, auth, tools, sync/webhook handlers and schemas while inheriting platform observability/security contracts.
