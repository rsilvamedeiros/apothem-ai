import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RunsView } from "./runs-view";
import type { LoadRunsResult } from "./load-runs";
import type { RunView } from "./run-view";

const run = (overrides: Partial<RunView> = {}): RunView => ({
  id: "44444444-4444-4444-8444-444444444444",
  agentId: "a1",
  agentVersionId: "v1",
  requestedByPrincipalId: "p1",
  status: "completed",
  input: { text: "Summarize the refund policy for enterprise customers" },
  output: { text: "ok" },
  errorCode: null,
  errorMessage: null,
  modelProvider: "mock",
  model: "mock-1",
  inputTokens: 1,
  outputTokens: 1,
  createdAt: "2026-03-04T05:06:07.000Z",
  startedAt: null,
  finishedAt: null,
  ...overrides,
});

const ok = (runs: RunView[], nextCursor: string | null = null): LoadRunsResult => ({ kind: "ok", runs, nextCursor });

describe("RunsView", () => {
  it("lists runs with status, task and a link to the detail page", () => {
    render(<RunsView result={ok([run()])} basePath="/w/runs" />);
    const row = screen.getAllByRole("row")[1]!;
    expect(within(row).getByText("Completed")).toBeInTheDocument();
    expect(within(row).getByText(/Summarize the refund policy/)).toBeInTheDocument();
    expect(within(row).getByRole("link")).toHaveAttribute("href", "/w/runs/44444444-4444-4444-8444-444444444444");
    expect(within(row).getByText("2026-03-04 05:06:07 UTC")).toBeInTheDocument();
  });

  it("truncates a long task so the table stays readable", () => {
    render(<RunsView result={ok([run({ input: { text: "x".repeat(500) } })])} basePath="/w/runs" />);
    expect(screen.getByText(/^x+…$/).textContent!.length).toBeLessThan(130);
  });

  it("shows failed runs with their failure kind", () => {
    render(<RunsView result={ok([run({ status: "failed", output: null, errorCode: "MODEL_POLICY_NO_ROUTE" })])} basePath="/w/runs" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("No approved model matches this agent")).toBeInTheDocument();
  });

  it("pages with an encoded cursor and links back to the latest runs", () => {
    const { rerender } = render(<RunsView result={ok([run()], "a+b=")} basePath="/w/runs" />);
    expect(screen.getByRole("link", { name: "Older runs" })).toHaveAttribute("href", "/w/runs?cursor=a%2Bb%3D");
    rerender(<RunsView result={ok([run()])} basePath="/w/runs" isLaterPage />);
    expect(screen.queryByRole("link", { name: "Older runs" })).toBeNull();
    expect(screen.getByRole("link", { name: "Latest runs" })).toHaveAttribute("href", "/w/runs");
  });

  it("shows an empty state", () => {
    render(<RunsView result={ok([])} basePath="/w/runs" />);
    expect(screen.getByText(/No runs yet/)).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("renders task text as text, never markup", () => {
    render(<RunsView result={ok([run({ input: { text: "<img src=x onerror=alert(1)>" } })])} basePath="/w/runs" />);
    expect(document.querySelector("img")).toBeNull();
  });

  it.each([
    [{ kind: "error", message: "You do not have permission to view runs." } as const, "permission"],
    [{ kind: "unreachable" } as const, "unreachable"],
  ])("announces failures (%j)", (result, text) => {
    render(<RunsView result={result} basePath="/w/runs" />);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
  });
});
