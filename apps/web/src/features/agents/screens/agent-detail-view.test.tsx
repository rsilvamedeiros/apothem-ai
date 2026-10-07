import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AgentDetailView } from "./agent-detail-view";
import type { LoadAgentDetailResult } from "../load-agent-detail";

const action = vi.fn(async () => ({ ok: true }));
const actions = {
  saveDraft: action,
  publish: action,
  disable: action,
  archive: action,
  startRun: vi.fn(async () => ({})),
  runBasePath: "/runs",
  saveTools: action,
  tools: {
    kind: "ok" as const,
    tools: [{ name: "create_note", description: "Saves a note.", risk: "reversible_write" as const, allowedApprovalModes: ["required" as const, "auto" as const] }],
  },
};

const ok = (status: "draft" | "active" | "disabled" | "archived" = "active"): LoadAgentDetailResult => ({
  kind: "ok",
  agent: { id: "a1", name: "Support", slug: "support", description: "Answers tickets", status, activeVersionId: "v2" },
  draft: { instructions: "Be kind.", toolBindings: [{ tool: "create_note", approval: "required" }], updatedAt: "2026-01-02T00:00:00.000Z" },
  versions: [
    { id: "v2", versionNumber: 2, checksum: "b".repeat(64), createdAt: "2026-01-02T00:00:00.000Z" },
    { id: "v1", versionNumber: 1, checksum: "a".repeat(64), createdAt: "2026-01-01T00:00:00.000Z" },
  ],
});

describe("AgentDetailView", () => {
  it("shows identity, status and the draft", () => {
    render(<AgentDetailView result={ok()} backHref="/back" {...actions} />);
    expect(screen.getByRole("heading", { level: 1, name: "Support" })).toBeInTheDocument();
    expect(screen.getByText("support")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByLabelText("Instructions")).toHaveValue("Be kind.");
  });

  it("lists versions newest first, marks the active one and shortens checksums", () => {
    render(<AgentDetailView result={ok()} backHref="/back" {...actions} />);
    const rows = within(screen.getByRole("heading", { name: "Versions" }).closest("section")!).getAllByRole("listitem");
    expect(within(rows[0]!).getByText("Version 2")).toBeInTheDocument();
    expect(within(rows[0]!).getByText("Active version")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("Version 1")).toBeInTheDocument();
    expect(within(rows[1]!).queryByText("Active version")).toBeNull();
    expect(within(rows[0]!).getByText("bbbbbbbb")).toBeInTheDocument();
  });

  it("says when nothing has been published yet", () => {
    const result = ok("draft");
    if (result.kind === "ok") result.versions = [];
    render(<AgentDetailView result={result} backHref="/back" {...actions} />);
    expect(screen.getByText("No versions published yet.")).toBeInTheDocument();
  });

  it("makes an archived agent read-only", () => {
    render(<AgentDetailView result={ok("archived")} backHref="/back" {...actions} />);
    expect(screen.getByLabelText("Instructions")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Publish new version" })).toBeNull();
  });

  it("renders agent text as text, never markup", () => {
    const result = ok();
    if (result.kind === "ok") result.agent.name = "<script>alert(1)</script>";
    render(<AgentDetailView result={result} backHref="/back" {...actions} />);
    expect(document.querySelector("script")).toBeNull();
  });

  it.each([
    [{ kind: "not_found" } as const, "Agent not found."],
    [{ kind: "error", message: "You do not have access to this agent." } as const, "You do not have access to this agent."],
    [{ kind: "unreachable" } as const, "apothem-api is unreachable. Try again shortly."],
  ])("renders a non-ok result (%j)", (result, text) => {
    render(<AgentDetailView result={result} backHref="/back" {...actions} />);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
    expect(screen.getByRole("link", { name: /Agents/ })).toHaveAttribute("href", "/back");
  });

  it("lets an active agent be tested from the page", () => {
    render(<AgentDetailView result={ok("active")} backHref="/back" {...actions} />);
    expect(screen.getByRole("heading", { name: "Test run" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run agent" })).toBeInTheDocument();
  });

  it.each(["draft", "disabled", "archived"] as const)("does not offer a test run for a %s agent", (status) => {
    render(<AgentDetailView result={ok(status)} backHref="/back" {...actions} />);
    expect(screen.queryByRole("button", { name: "Run agent" })).toBeNull();
  });

  it("lets the agent author choose which tools the agent may use, starting from the saved bindings", () => {
    render(<AgentDetailView result={ok("active")} backHref="/back" {...actions} />);
    expect(screen.getByRole("heading", { name: "Tools" })).toBeInTheDocument();
    expect(screen.getByLabelText(/create note/i)).toHaveValue("required");
    expect(screen.getByRole("button", { name: "Save tools" })).toBeEnabled();
  });

  it("makes the tool editor read-only for an archived agent", () => {
    render(<AgentDetailView result={ok("archived")} backHref="/back" {...actions} />);
    expect(screen.getByLabelText(/create note/i)).toBeDisabled();
  });

  it("explains when the tool catalog could not be loaded instead of showing an empty editor", () => {
    render(<AgentDetailView result={ok("active")} backHref="/back" {...actions} tools={{ kind: "error", message: "The tool catalog could not be loaded." }} />);
    expect(screen.getByText("The tool catalog could not be loaded.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save tools" })).toBeNull();
  });
});
