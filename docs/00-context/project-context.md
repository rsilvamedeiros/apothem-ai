# Project Context

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Why APOTHEM exists

Organizations increasingly have access to capable models, yet the models remain separated from the systems, permissions, policies and data that define real work. The gap is not primarily “access to an LLM”; it is the absence of a governed operational layer that can convert business context into safe action.

APOTHEM is intended to occupy this gap.

```text
Business systems + Knowledge + Policies + People
                    │
                    ▼
              APOTHEM AI
                    │
        Understand / Reason / Govern
                    │
                    ▼
          Authorized business action
```

## What is being built

APOTHEM is an **Enterprise AI platform and reusable intelligence core**. A company should be able to create agents, give them approved knowledge, connect tools and systems, define autonomy/approval rules, execute work, and inspect everything that happened.

The same core should also support vertical products and bespoke business solutions without creating a separate AI stack for each product.

## Initial product families

- **Apothem Core** — runtime, orchestration, policies, context and shared platform capability.
- **Apothem Agents** — configured AI workers with goals, instructions, knowledge, tools and permissions.
- **Apothem Studio** — configuration experience for creating and managing agents.
- **Apothem Knowledge** — enterprise knowledge ingestion and retrieval.
- **Apothem Connect** — integrations, credentials and tool adapters.
- **Apothem Flow** — durable workflows combining deterministic logic and agent reasoning.
- **Apothem Control** — governance, audit, usage, security and observability.

These names are product architecture language, not a commitment that every capability launches as an independent SKU.

## Commercial operating model

The initial go-to-market is **Product + Solutions**. APOTHEM can solve real enterprise problems before every platform surface is self-service. However, custom work should be implemented through reusable platform capabilities whenever possible. The company should resist becoming a generic software house whose projects do not strengthen the core.

## Current constraints

- Initial market: Brazil.
- Canonical domain: `apothemai.com.br`.
- B2B/enterprise orientation.
- Multi-tenant SaaS readiness from the beginning.
- LGPD-aware data handling.
- Multi-model/provider abstraction.
- Human-in-the-loop as a first-class execution concept.
- API-first capability even when the initial customer uses the APOTHEM UI.

## Working success definition

The platform proves its thesis when a customer can give an agent a business objective and the agent can use authorized knowledge and tools to complete or prepare meaningful work with traceable reasoning artifacts, policy enforcement and explicit approvals where required.
