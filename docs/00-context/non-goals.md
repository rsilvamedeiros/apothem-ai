# Explicit Non-Goals

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

APOTHEM is intentionally ambitious, therefore explicit non-goals are necessary to keep early architecture implementable.

## Not an ERP replacement
The platform integrates with systems of record. It does not attempt to replicate full finance, HR, CRM or supply-chain suites.

## Not a generic no-code platform in V1
A visual workflow builder may come later. The first requirement is a reliable workflow execution model, not a canvas editor.

## Not unrestricted autonomous agents
Autonomy is bounded by tool scopes, policies and approval rules. There is no product goal of granting a model arbitrary operating-system/database access.

## Not every AI provider feature at launch
The model gateway abstracts common product needs. Provider-specific capabilities may be exposed deliberately where they create clear value, but the product should not become a lowest-common-denominator proxy either.

## Not a marketplace at MVP
Templates and reusable connectors should be architected for reuse, but public marketplace economics/distribution are post-MVP.

## Not premature microservices
The architecture documents extraction seams; they do not require separate deployments on day one.

## Not a promise of perfect reasoning
The product promise is controlled, observable assistance/action — not infallibility.
