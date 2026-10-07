# Forms, Errors and Accessibility

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Use shared schema contracts where appropriate while keeping server validation authoritative. Configuration forms should distinguish draft unsaved changes, validation errors and publish readiness.

Errors should be actionable and map stable API error codes to user guidance. Model/provider failures should not expose vendor internals unless the user is an authorized builder/admin and the information is safe.

Accessibility baseline includes keyboard navigation, focus states, semantic labels, status announcements for asynchronous processing, non-color-only risk/status communication and accessible approval actions.

## Implemented pattern (apps/web, agents feature)

- Mutations are Next.js server actions that only add `redirect`/`revalidatePath` around a framework-free command (`agent-commands.ts`, `submit-create-agent.ts`) so the logic is unit-tested without Next.
- Tenant ids come from the route and are bound by the page; they are never form fields. Every id that reaches a URL path or API call is checked as a UUID first, and apothem-api re-checks membership on every call.
- Client-side validation mirrors the API limits for fast feedback only; the API response always wins.
- Commands translate every API outcome into a fixed, user-safe message. API error bodies are never rendered.
- Forms are controlled so a failed submit keeps the user's input; field errors use `aria-invalid` and `aria-describedby`, successes use `role="status"` and failures `role="alert"`.
- Destructive, irreversible actions (archive) require an explicit confirmation step. The UI mirrors but never decides lifecycle rules (archived is terminal in the API).
- Demo data is a development aid only and is never used when `NODE_ENV` is `production`.

## Runs UI (apps/web, runs feature)

- A run that ends `failed` is a successful call: the failure is part of the durable record and is shown with guidance mapped from the stable public error code. Unknown codes fall back to generic guidance and are never rendered, and the API's `errorMessage` is not displayed.
- Starting a run sends only the task text and an idempotency key. The key is generated per submit attempt on the client and regenerated after a finished run, so a double click replays one run instead of paying for two. A missing or malformed key is replaced server-side.
- Tenant, agent and run ids come from the route; the form has no tenant fields. The Test run panel is offered only for an active, published agent.
- Task text and model answers are rendered as text. Timestamps are shown in a fixed UTC format.
