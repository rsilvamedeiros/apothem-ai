# Credentials and OAuth

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Connection metadata lives in application storage; sensitive credentials/tokens live through a secrets/vault abstraction with encryption and rotation support.

OAuth lifecycle: initiate with tenant/workspace/actor context → state/PKCE validation → callback → securely store token set → verify minimal scopes → mark connection active → refresh server-side → revoke/disconnect.

Never log access/refresh tokens. Connection status should distinguish valid, degraded, expired, revoked and permission_changed.
