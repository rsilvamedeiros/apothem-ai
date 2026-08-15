# Connections, Tools and Bindings

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

**Connection** answers “how do we authenticate/reach this external system?”. It stores non-secret metadata plus a reference to securely stored credentials.

**Tool Definition** answers “what operation exists?” and includes typed input/output schemas, risk classification, idempotency characteristics and connector executor.

**Tool Binding** answers “which agent/workflow may use this operation and under which scope/policy?”. Binding can narrow accessible account, project, fields, destination or action parameters.

Never give an agent generic connection credentials. The runtime grants invocation of a tool binding, not possession of the underlying secret.
