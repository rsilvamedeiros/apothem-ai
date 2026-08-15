# Claude Code — Start Here

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

This is the recommended entry point when the repository is opened in Claude Code for implementation.

## Before writing code

Read in this order:
1. `/CLAUDE.md`
2. `/AGENTS.md`
3. `/README.md`
4. `/docs/00-context/project-context.md`
5. `/docs/00-context/decision-status.md`
6. `/docs/01-product/product-requirements.md`
7. `/docs/02-architecture/architecture-overview.md`
8. `/docs/03-domain/domain-model.md`
9. `/docs/08-security/security-model.md`
10. `/docs/17-roadmap/mvp.md`
11. `/docs/17-roadmap/first-implementation-sequence.md`

Then read module-specific documents before implementing that module.

## First objective

Do not attempt to “build APOTHEM” in one prompt. The first implementation objective is **Foundation + tenancy + repository contracts**, leaving a clean base for Agent Runtime.

Expected first working checkpoint:
- monorepo builds;
- local PostgreSQL boots;
- environment/schema validation works;
- migrations run;
- API health endpoint works;
- authenticated principal abstraction exists (real provider may be mocked/adapter initially);
- Organization/Workspace/Membership persistence and authorization exist;
- cross-tenant tests prove denial;
- CI runs lint/type/tests/build;
- no AI provider dependency is required yet.

## How to use the docs

Documentation describes intention/invariants. If a technology-specific implementation question is open, propose the narrowest option and record an ADR when it materially constrains architecture. Do not invent product features merely because a library makes them easy.

## Important reminder

APOTHEM is not a chatbot project. The repository should be shaped around durable domain resources and enterprise controls even before the first visible agent demo.
