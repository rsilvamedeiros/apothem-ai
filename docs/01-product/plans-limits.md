# Plans and Limit Model

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Pricing is intentionally not finalized, but technical metering should not need to be rebuilt later.

Potential billable dimensions:
- active seats;
- agent runs;
- model input/output tokens or normalized AI credits;
- document storage;
- indexed/vector storage;
- workflow executions;
- tool executions;
- premium connector usage;
- retention period;
- concurrency;
- enterprise governance features.

The runtime should emit usage events independently of a billing vendor. Billing translates usage into commercial plans later.

Hard limits, soft limits and alert thresholds should be distinct concepts. Exceeding a soft monthly budget may warn/admin-alert, while a hard security/concurrency limit can block execution.
