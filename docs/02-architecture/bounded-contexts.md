# Bounded Contexts

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Identity & Tenancy
Organizations, workspaces, memberships, roles, invitations, API principals.

## Agents
Agent identity, drafts, versions, deployments/configuration and run requests.

## Knowledge
Knowledge bases, sources, ingestion, chunks, indexes, retrieval evidence and synchronization.

## Connect
Connections, credentials references, connector definitions, tool definitions/bindings and external calls.

## Flow
Workflow definitions/versions, triggers, nodes, execution state, approvals and resumability.

## Control
Audit, usage, policy visibility, evaluations, operational telemetry and governance views.

## Billing (later)
Plans, entitlements, subscriptions and invoices. It consumes usage/organization events but should not own core execution behavior.

Contexts may share identifiers but should not directly mutate each other’s persistence internals. For example, deleting/archiving an agent does not physically delete run history owned by execution/control records.
