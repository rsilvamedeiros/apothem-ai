# Secrets and Encryption

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Credentials include provider keys, OAuth refresh/access tokens, database passwords and customer API secrets.

Requirements:
- no plaintext credentials in normal application tables or logs;
- encrypted secret store/vault abstraction;
- secret references scoped to organization/workspace/connection;
- rotation/revocation lifecycle;
- least-privilege runtime identity for secret retrieval;
- audit sensitive secret-management actions without logging secret value.

Use TLS for transport and encryption at rest through managed infrastructure. Application-level field encryption may be added for particularly sensitive data after data classification is defined.
