import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RunDetailView } from "./run-detail-view";
import type { LoadRunResult } from "./load-runs";
import type { RunStepView, RunView } from "./run-view";

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
    render(<RunDetailView result={{ kind: "ok", run, steps: [step] } as LoadRunResult} backHref="/runs" agentHref="/agents/a" />);
    expect(screen.getByText("pong")).toBeInTheDocument();
    expect(screen.getByText("66666666")).toHaveAttribute("title", run.agentVersionId);
    const steps = screen.getAllByRole("listitem");
    expect(within(steps[0]!).getByText("model_call")).toBeInTheDocument();
    expect(within(steps[0]!).getByText("250 ms")).toBeInTheDocument();
    expect(within(steps[0]!).getByText("stop")).toBeInTheDocument();
  });

  it("links back to the list and to the agent", () => {
    render(<RunDetailView result={{ kind: "ok", run, steps: [] }} backHref="/runs" agentHref="/agents/a" />);
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
        }}
        backHref="/runs"
        agentHref="/agents/a"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("The run took too long");
  });

  it("says when a run has no recorded steps", () => {
    render(<RunDetailView result={{ kind: "ok", run, steps: [] }} backHref="/runs" agentHref="/agents/a" />);
    expect(screen.getByText("No steps were recorded.")).toBeInTheDocument();
  });

  it.each([
    [{ kind: "not_found" } as const, "Run not found."],
    [{ kind: "error", message: "You do not have permission to view runs." } as const, "permission"],
    [{ kind: "unreachable" } as const, "unreachable"],
  ])("renders a non-ok result (%j)", (result, text) => {
    render(<RunDetailView result={result} backHref="/runs" agentHref="/agents/a" />);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
  });
});
