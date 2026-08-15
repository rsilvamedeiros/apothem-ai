# Audit, Retention and LGPD

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

LGPD engineering principles: purpose limitation, data minimization, access control, retention discipline, transparency and support for data-subject/customer obligations.

Define data categories separately:
- account/membership data;
- customer business content;
- model inputs/outputs;
- retrieved knowledge evidence;
- tool payloads/results;
- audit/security events;
- telemetry logs;
- billing/usage records.

Each category needs purpose, retention and deletion/anonymization behavior. “Delete user” cannot simply erase audit evidence required to explain historic privileged actions; identity may be pseudonymized where legally/contractually appropriate.

Provider data-processing settings must respect customer/provider policy and should be configurable for enterprise requirements later.
