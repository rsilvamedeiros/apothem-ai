import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApprovalsView } from "./approvals-view";
import type { LoadApprovalsResult } from "./load-approvals";
import type { ApprovalView } from "../runs/run-view";

const approval = (overrides: Partial<ApprovalView> = {}): ApprovalView => ({
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
  ...overrides,
});

const ok = (approvals: ApprovalView[], nextCursor: string | null = null): LoadApprovalsResult => ({ kind: "ok", approvals, nextCursor });
const props = { basePath: "/w/approvals", runBasePath: "/w/runs", status: "pending" as const, decide: () => vi.fn(async () => ({ ok: true })) };

describe("ApprovalsView", () => {
  it("lists pending proposals with decision controls and a link to each run", () => {
    render(<ApprovalsView result={ok([approval()])} {...props} />);
    expect(screen.getByText("Create note")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View run" })).toHaveAttribute("href", "/w/runs/44444444-4444-4444-8444-444444444444");
  });

  it("does not offer decisions on decided approvals", () => {
    render(<ApprovalsView result={ok([approval({ status: "approved", decidedAt: "2026-03-04T13:00:00.000Z" })])} {...props} status="approved" />);
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
  });

  it("lets you switch between statuses with links, marking the current one", () => {
    render(<ApprovalsView result={ok([])} {...props} />);
    const nav = screen.getByRole("navigation", { name: "Approval status" });
    expect(within(nav).getByRole("link", { name: "Pending" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Approved" })).toHaveAttribute("href", "/w/approvals?status=approved");
    expect(within(nav).getByRole("link", { name: "Rejected" })).toHaveAttribute("href", "/w/approvals?status=rejected");
    expect(within(nav).getByRole("link", { name: "Expired" })).toHaveAttribute("href", "/w/approvals?status=expired");
  });

  it("pages with an encoded cursor that keeps the status", () => {
    render(<ApprovalsView result={ok([approval()], "a+b=")} {...props} status="approved" />);
    expect(screen.getByRole("link", { name: "Older" })).toHaveAttribute("href", "/w/approvals?status=approved&cursor=a%2Bb%3D");
  });

  it("shows an empty state that fits the status", () => {
    const { rerender } = render(<ApprovalsView result={ok([])} {...props} />);
    expect(screen.getByText("No pending approvals.")).toBeInTheDocument();
    rerender(<ApprovalsView result={ok([])} {...props} status="expired" />);
    expect(screen.getByText("No expired approvals.")).toBeInTheDocument();
  });

  it.each([
    [{ kind: "error", message: "Only owners and admins can view the approval inbox." } as const, "owners and admins"],
    [{ kind: "unreachable" } as const, "unreachable"],
  ])("announces failures (%j)", (result, text) => {
    render(<ApprovalsView result={result} {...props} />);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
  });
});
