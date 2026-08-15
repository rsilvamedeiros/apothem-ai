# Priority Use Cases

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## UC-01 — Enterprise knowledge analyst
A user asks a policy/process question. The agent retrieves only authorized knowledge, synthesizes an answer and cites the underlying sources. No side effect.

## UC-02 — Customer/lead research with CRM context
The agent receives a company/customer identifier, reads CRM and allowed public/internal context, summarizes relevant information and suggests next action.

## UC-03 — Financial/document review
A document enters a knowledge/work queue. The agent extracts fields, validates them against business rules and an ERP lookup, flags anomalies and prepares a structured review.

## UC-04 — Approval-gated update
The agent prepares an action such as updating CRM status, creating a ticket, sending an external message or registering an internal record. Policy requires approval. An authorized human sees the exact proposed payload, approves, and execution resumes.

## UC-05 — Operational exception handling
A scheduled/event trigger detects a condition. Deterministic rules narrow the case; the agent analyzes unstructured context; the workflow either resolves it automatically within a low-risk boundary or requests human intervention.

## UC-06 — Internal technology assistant
The agent uses documentation, runbooks and approved observability tools to diagnose a problem and suggest remediation. Production-mutating tools remain restricted or approval-gated.

Each use case should eventually become an evaluation/test scenario and a reusable solution template.
