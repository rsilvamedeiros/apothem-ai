import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { RunView } from "../run-view";
import { RunPanel, type RunPanelState } from "./run-panel";

const completed: RunView = {
  id: "44444444-4444-4444-8444-444444444444",
  agentId: "a1",
  agentVersionId: "v1",
  requestedByPrincipalId: "p1",
  status: "completed",
  input: { text: "ping" },
  output: { text: "pong" },
  errorCode: null,
  errorMessage: null,
  modelProvider: "mock",
  model: "mock-1",
  inputTokens: 1,
  outputTokens: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  startedAt: "2026-01-01T00:00:00.000Z",
  finishedAt: "2026-01-01T00:00:01.000Z",
};

type Action = (prev: RunPanelState, form: FormData) => Promise<RunPanelState>;
const make = (state: RunPanelState) => vi.fn<Action>(async () => state);

describe("RunPanel", () => {
  it("offers a labelled task field limited to the API size", () => {
    render(<RunPanel action={make({})} runnable />);
    const field = screen.getByLabelText("Task");
    expect(field).toBeRequired();
    expect(field).toHaveAttribute("maxlength", "20000");
    expect(screen.getByRole("button", { name: "Run agent" })).toBeEnabled();
  });

  it("submits the task with a client generated idempotency key", async () => {
    const action = make({ run: completed });
    render(<RunPanel action={action} runnable />);
    await userEvent.type(screen.getByLabelText("Task"), "ping");
    await userEvent.click(screen.getByRole("button", { name: "Run agent" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get("task")).toBe("ping");
    expect(String(form.get("idempotencyKey"))).toMatch(/^[A-Za-z0-9_.:-]{8,100}$/);
  });

  it("shows the finished run in a result card", async () => {
    render(<RunPanel action={make({ run: completed })} runnable />);
    await userEvent.type(screen.getByLabelText("Task"), "ping");
    await userEvent.click(screen.getByRole("button", { name: "Run agent" }));
    expect(await screen.findByText("pong")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows API refusals as alerts and keeps the typed task", async () => {
    render(<RunPanel action={make({ message: "This agent cannot run right now." })} runnable />);
    await userEvent.type(screen.getByLabelText("Task"), "keep me");
    await userEvent.click(screen.getByRole("button", { name: "Run agent" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("cannot run right now");
    expect(screen.getByLabelText("Task")).toHaveValue("keep me");
  });

  it("explains that an agent must be published and disables running", () => {
    render(<RunPanel action={make({})} runnable={false} />);
    expect(screen.getByText(/Publish the agent/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Run agent" })).toBeNull();
  });
});
