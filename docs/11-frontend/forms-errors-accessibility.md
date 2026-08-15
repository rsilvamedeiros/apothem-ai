# Forms, Errors and Accessibility

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Use shared schema contracts where appropriate while keeping server validation authoritative. Configuration forms should distinguish draft unsaved changes, validation errors and publish readiness.

Errors should be actionable and map stable API error codes to user guidance. Model/provider failures should not expose vendor internals unless the user is an authorized builder/admin and the information is safe.

Accessibility baseline includes keyboard navigation, focus states, semantic labels, status announcements for asynchronous processing, non-color-only risk/status communication and accessible approval actions.
