# Security Policy

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

APOTHEM is intended to handle enterprise knowledge, credentials and actions. Security therefore begins at architecture, not post-MVP hardening.

Never commit production credentials, API keys, private datasets or customer documents. Secrets must be referenced through environment/secret-management abstractions.

Potential vulnerabilities should be handled privately and with enough detail to reproduce the issue. Security-sensitive fixes must include tests when practical and must not disclose customer information in commit history.

The project threat model is documented in `docs/08-security/threat-model-ai-security.md` and includes AI-specific threats such as prompt injection, tool abuse, knowledge poisoning and cross-tenant retrieval leakage.
