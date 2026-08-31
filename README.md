# APOTHEM AI

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

> **Intelligence at the core.**

APOTHEM AI is being designed as an **Enterprise AI / Intelligent Automation platform** for connecting company knowledge, systems, people, processes and policies to AI agents capable of understanding context, reasoning within explicit boundaries and executing authorized actions.

The platform thesis is intentionally broader than “chat with company data” and narrower than “build every business system”. APOTHEM owns the **intelligence and orchestration layer** between business context and operational action.

## Product thesis

**Intelligence Layer for Business**

```text
UNDERSTAND → CONNECT → REASON → ACT
```

The platform combines:

```text
Context + Knowledge + Agents + Tools + Integrations + Workflows + Governance
```

## Canonical domain strategy

| Surface | Production URL | Responsibility |
|---|---|---|
| Institutional website | `https://apothemai.com.br` | Positioning, acquisition, content, trust |
| Product application | `https://app.apothemai.com.br` | Authenticated APOTHEM workspace |
| API | `https://api.apothemai.com.br` | Internal and future public API |
| Documentation | `https://docs.apothemai.com.br` | Product/API/engineering documentation |
| Status | `https://status.apothemai.com.br` | Operational status and incidents |

The repository treats `apothemai.com.br` as the canonical project domain. Legal availability, trademark clearance and final registrar ownership remain launch-readiness checks rather than architecture assumptions.

## Repository philosophy

This repository starts **documentation-first**. The first milestone is not a screen or endpoint. It is a shared technical and product model precise enough that implementation agents and engineers do not need to invent core behavior while coding.

The initial implementation is expected to be a **modular monorepo** with independently deployable web/API/worker surfaces, while preserving clear extraction seams for services that may later need separate scaling or ownership.

```text
apothem-ai/
├── apps/
│   └── site/             # institutional website (apothemai.com.br) — scaffolded
├── packages/             # future shared libraries and contracts
├── services/             # future extracted services when justified
├── infra/                # infrastructure definitions
├── tooling/               # repository tooling
└── docs/                  # current source of truth
```

## Local development

```bash
npm install
npm run dev:site      # http://localhost:3000
```

## Read this first

1. `docs/00-context/project-context.md`
2. `docs/00-context/product-vision.md`
3. `docs/01-product/product-requirements.md`
4. `docs/02-architecture/architecture-overview.md`
5. `docs/03-domain/domain-model.md`
6. `docs/04-ai/agent-runtime.md`
7. `docs/08-security/security-model.md`
8. `docs/17-roadmap/mvp.md`
9. `CLAUDE.md`
10. `AGENTS.md`
11. `docs/19-handoff/claude-start-here.md`

## Current status

**Discovery complete enough to begin architecture foundation.**

The next step after reviewing this package is to scaffold the monorepo without changing the documented domain language or core safety constraints unless an ADR is created.
