import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RunDetailView } from "./run-detail-view";
import type { LoadRunResult } from "./load-runs";
import type { ApprovalView, RunStepView, RunView } from "./run-view";

const decide = () => vi.fn(async () => ({ ok: true }));
const pendingApproval: ApprovalView = {
  id: "55555555-5555-4555-8555-555555555555",
  runId: "44444444-4444-4444-8444-444444444444",
  agentId: "a1",
  stepSequence: 2,
  toolName: "create_note",
  arguments: { title: "Call back", body: "Tomorrow" },
  requestedByPrincipalId: "p1",
  status: "pending",
  expiresAt: "2026-03-05T12:00:00.000Z",
  decidedByPrincipalId: null,
  decisionReason: null,
  selfApproved: false,
  decidedAt: null,
  createdAt: "2026-03-04T12:00:00.000Z",
};

const run: RunView = {
  id: "44444444-4444-4444-8444-444444444444",
  agentId: "55555555-5555-4555-8555-555555555555",
  agentVersionId: "66666666-6666-4666-8666-666666666666",
  requestedByPrincipalId: "p1",
  status: "completed",
  input: { text: "ping" },
  output: { text: "pong" },
  errorCode: null,
  errorMessage: null,
  modelProvider: "mock",
  model: "mock-1",
  inputTokens: 3,
  outputTokens: 4,
  createdAt: "2026-03-04T05:06:07.000Z",
  startedAt: "2026-03-04T05:06:07.000Z",
  finishedAt: "2026-03-04T05:06:08.000Z",
};

const step: RunStepView = {
  id: "s1",
  sequence: 1,
  type: "model_call",
  status: "completed",
  modelProvider: "mock",
  model: "mock-1",
  inputTokens: 3,
  outputTokens: 4,
  finishReason: "stop",
  durationMs: 250,
  errorCode: null,
};

describe("RunDetailView", () => {
  it("shows the run, the pinned agent version and its steps", () => {
    render(<RunDetailView result={{ kind: "ok", run, steps: [step], approvals: [] } as LoadRunResult} backHref="/runs" agentHref="/agents/a" decide={decide} />);
    expect(screen.getByText("pong")).toBeInTheDocument();
    expect(screen.getByText("66666666")).toHaveAttribute("title", run.agentVersionId);
    const steps = screen.getAllByRole("listitem");
    expect(within(steps[0]!).getByText("model_call")).toBeInTheDocument();
    expect(within(steps[0]!).getByText("250 ms")).toBeInTheDocument();
    expect(within(steps[0]!).getByText("stop")).toBeInTheDocument();
  });

  it("links back to the list and to the agent", () => {
    render(<RunDetailView result={{ kind: "ok", run, steps: [], approvals: [] }} backHref="/runs" agentHref="/agents/a" decide={decide} />);
    expect(screen.getByRole("link", { name: /Runs/ })).toHaveAttribute("href", "/runs");
    expect(screen.getByRole("link", { name: "View agent" })).toHaveAttribute("href", "/agents/a");
  });

  it("shows failure guidance for a failed step and run", () => {
    render(
      <RunDetailView
        result={{
          kind: "ok",
          run: { ...run, status: "failed", output: null, errorCode: "RUN_BUDGET_EXCEEDED" },
          steps: [{ ...step, status: "failed", errorCode: "RUN_BUDGET_EXCEEDED", finishReason: null }],
          approvals: [],
        }}
        backHref="/runs"
        agentHref="/agents/a"
        decide={decide}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("The run took too long");
  });

  it("says when a run has no recorded steps", () => {
    render(<RunDetailView result={{ kind: "ok", run, steps: [], approvals: [] }} backHref="/runs" agentHref="/agents/a" decide={decide} />);
    expect(screen.getByText("No steps were recorded.")).toBeInTheDocument();
  });

  it.each([
    [{ kind: "not_found" } as const, "Run not found."],
    [{ kind: "error", message: "You do not have permission to view runs." } as const, "permission"],
    [{ kind: "unreachable" } as const, "unreachable"],
  ])("renders a non-ok result (%j)", (result, text) => {
    render(<RunDetailView result={result} backHref="/runs" agentHref="/agents/a" decide={decide} />);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
  });

  it("shows the proposal a waiting run is blocked on, with decision controls for pending approvals", () => {
    render(
      <RunDetailView
        result={{ kind: "ok", run: { ...run, status: "waiting_approval", output: null }, steps: [], approvals: [pendingApproval] }}
        backHref="/runs"
        agentHref="/agents/a"
        decide={decide}
      />,
    );
    expect(screen.getByRole("heading", { name: "Approvals" })).toBeInTheDocument();
    expect(screen.getByText("Create note")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
  });

  it("keeps decided approvals as history without controls", () => {
    render(
      <RunDetailView
        result={{ kind: "ok", run, steps: [], approvals: [{ ...pendingApproval, status: "approved", decidedAt: "2026-03-04T13:00:00.000Z" }] }}
        backHref="/runs"
        agentHref="/agents/a"
        decide={decide}
      />,
    );
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
  });

  it("omits the approvals section when the run never needed one", () => {
    render(<RunDetailView result={{ kind: "ok", run, steps: [], approvals: [] }} backHref="/runs" agentHref="/agents/a" decide={decide} />);
    expect(screen.queryByRole("heading", { name: "Approvals" })).toBeNull();
  });

  describe("sources consulted", () => {
    const sources = [
      { stepSequence: 2, evidenceId: "11111111-1111-4111-8111-111111111111", title: "Refund policy", section: "Refunds", ordinal: 2 },
      { stepSequence: 2, evidenceId: "22222222-2222-4222-8222-222222222222", title: "Shipping", section: null, ordinal: 0 },
    ];

    it("lists what the run read, with where each passage came from", () => {
      render(<RunDetailView result={{ kind: "ok", run, steps: [], approvals: [], sources }} backHref="/runs" agentHref="/agents/a" decide={decide} />);
      const list = screen.getByRole("list", { name: "Sources consulted" });
      const items = within(list).getAllByRole("listitem");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("Refund policy");
      expect(items[0]).toHaveTextContent("Refunds, passage 3");
      expect(items[0]).toHaveTextContent("step 2");
      expect(items[1]).toHaveTextContent("Shipping");
      expect(items[1]).toHaveTextContent("passage 1");
      expect(screen.getByText(/The text itself stays in the knowledge base/)).toBeInTheDocument();
    });

    it("renders titles as text, never markup", () => {
      render(
        <RunDetailView
          result={{ kind: "ok", run, steps: [], approvals: [], sources: [{ ...sources[0]!, title: "<script>alert(1)</script><b>x</b>" }] }}
          backHref="/runs"
          agentHref="/agents/a"
          decide={decide}
        />,
      );
      expect(document.querySelector("script")).toBeNull();
      expect(screen.getByRole("list", { name: "Sources consulted" }).querySelector("b")).toBeNull();
    });

    it("shows no section when the run read nothing, or when the API sent no sources", () => {
      const { rerender } = render(<RunDetailView result={{ kind: "ok", run, steps: [], approvals: [], sources: [] }} backHref="/runs" agentHref="/agents/a" decide={decide} />);
      expect(screen.queryByText("Sources consulted")).toBeNull();
      rerender(<RunDetailView result={{ kind: "ok", run, steps: [], approvals: [] }} backHref="/runs" agentHref="/agents/a" decide={decide} />);
      expect(screen.queryByText("Sources consulted")).toBeNull();
    });
  });
});
