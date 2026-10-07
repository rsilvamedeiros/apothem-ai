import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RunView } from "../run-view";
import { RunResultCard } from "./run-result-card";

const base: RunView = {
  id: "44444444-4444-4444-8444-444444444444",
  agentId: "a1",
  agentVersionId: "v1",
  requestedByPrincipalId: "p1",
  status: "completed",
  input: { text: "What is my balance?" },
  output: { text: "Your balance is zero." },
  errorCode: null,
  errorMessage: null,
  modelProvider: "mock",
  model: "mock-1",
  inputTokens: 11,
  outputTokens: 7,
  createdAt: "2026-03-04T05:06:07.000Z",
  startedAt: "2026-03-04T05:06:07.000Z",
  finishedAt: "2026-03-04T05:06:08.500Z",
};

describe("RunResultCard", () => {
  it("shows the status, the task and the model answer", () => {
    render(<RunResultCard run={base} />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("What is my balance?")).toBeInTheDocument();
    expect(screen.getByText("Your balance is zero.")).toBeInTheDocument();
  });

  it("shows the model, token usage and duration", () => {
    render(<RunResultCard run={base} />);
    const meta = screen.getByTestId("run-meta");
    expect(within(meta).getByText("mock / mock-1")).toBeInTheDocument();
    expect(within(meta).getByText("11 in / 7 out tokens")).toBeInTheDocument();
    expect(within(meta).getByText("1.5 s")).toBeInTheDocument();
  });

  it("explains a failure with guidance, never the raw error message", () => {
    render(
      <RunResultCard
        run={{ ...base, status: "failed", output: null, errorCode: "MODEL_POLICY_NO_ROUTE", errorMessage: "internal <b>detail</b>" }}
      />,
    );
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("No approved model matches this agent");
    expect(screen.getByRole("alert")).toHaveTextContent("Relax the model policy");
    expect(screen.queryByText(/internal/)).toBeNull();
    expect(screen.getByText("MODEL_POLICY_NO_ROUTE")).toBeInTheDocument();
  });

  it("falls back to generic guidance for an unknown code and does not render it", () => {
    render(<RunResultCard run={{ ...base, status: "failed", output: null, errorCode: "NEW_CODE<script>" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent("The run failed");
    expect(document.querySelector("script")).toBeNull();
    expect(screen.queryByText(/NEW_CODE/)).toBeNull();
  });

  it("renders task and answer as text, never markup", () => {
    render(
      <RunResultCard
        run={{ ...base, input: { text: "<img src=x onerror=alert(1)>" }, output: { text: "<script>alert(2)</script>" } }}
      />,
    );
    expect(document.querySelector("img")).toBeNull();
    expect(document.querySelector("script")).toBeNull();
    expect(screen.getByText("<script>alert(2)</script>")).toBeInTheDocument();
  });

  it("omits the usage rows for a run that has none", () => {
    render(
      <RunResultCard
        run={{ ...base, status: "failed", output: null, errorCode: "RUN_BUDGET_EXCEEDED", modelProvider: null, model: null, inputTokens: null, outputTokens: null, startedAt: null, finishedAt: null }}
      />,
    );
    expect(screen.queryByText(/tokens/)).toBeNull();
    expect(screen.queryByText(/mock/)).toBeNull();
  });

  it("links to the run detail when a link target is provided", () => {
    render(<RunResultCard run={base} detailHref="/runs/abc" />);
    expect(screen.getByRole("link", { name: "View run details" })).toHaveAttribute("href", "/runs/abc");
  });
});
