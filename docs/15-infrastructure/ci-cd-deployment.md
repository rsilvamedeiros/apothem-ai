# CI/CD and Deployment

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

CI stages should include formatting/lint, type checks, unit/integration tests, migration validation, contract checks, build and security/dependency scans. AI eval suites may have fast PR subset and larger scheduled/pre-release suite.

Deployment should support independent web/API/worker releases but coordinated database compatibility. Use migrations before/with deploy using expand/contract. Rollback must account for schema and background workers, not only web application image.

Production deploys emit release/version metadata into telemetry.
