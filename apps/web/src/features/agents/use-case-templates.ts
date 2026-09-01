/**
 * Starting points for "choose a use-case template or blank agent"
 * (docs/12-ux/onboarding.md), drawn from the priority use cases in
 * docs/01-product/use-cases.md. Selecting one is not wired up yet —
 * agent creation needs apothem-api's agents endpoints first.
 */
export type UseCaseTemplate = {
  id: string;
  title: string;
  description: string;
};

export const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
  {
    id: "knowledge-analyst",
    title: "Knowledge analyst",
    description: "Answers policy/process questions from authorized knowledge, with citations.",
  },
  {
    id: "customer-research",
    title: "Customer research",
    description: "Reads CRM and allowed context, summarizes a customer and suggests next steps.",
  },
  {
    id: "document-review",
    title: "Document review",
    description: "Extracts fields, validates against business rules, and flags anomalies.",
  },
  {
    id: "blank",
    title: "Blank agent",
    description: "Start from nothing and define instructions, knowledge, and tools yourself.",
  },
];
