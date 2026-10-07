import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ApprovalView } from "../../runs/run-view";
import { ApprovalCard } from "./approval-card";

const base: ApprovalView = {
  id: "55555555-5555-4555-8555-555555555555",
  runId: "44444444-4444-4444-8444-444444444444",
  agentId: "a1",
  stepSequence: 2,
  toolName: "create_note",
  arguments: { title: "Call back", body: "Tomorrow 10am" },
  requestedByPrincipalId: "p1",
  status: "pending",
  expiresAt: "2026-03-05T12:00:00.000Z",
  decidedByPrincipalId: null,
  decisionReason: null,
  selfApproved: false,
  decidedAt: null,
  createdAt: "2026-03-04T12:00:00.000Z",
};

const decide = vi.fn(async () => ({ ok: true }));

describe("ApprovalCard", () => {
  it("shows what will happen: a readable tool name and every argument as text", () => {
    render(<ApprovalCard approval={base} />);
    expect(screen.getByText("Create note")).toBeInTheDocument();
    const args = screen.getByTestId("approval-arguments");
    expect(within(args).getByText("title")).toBeInTheDocument();
    expect(within(args).getByText("Call back")).toBeInTheDocument();
    expect(within(args).getByText("Tomorrow 10am")).toBeInTheDocument();
  });

  it("shows the status and when the request expires in UTC", () => {
    render(<ApprovalCard approval={base} />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("2026-03-05 12:00:00 UTC")).toHaveAttribute("datetime", "2026-03-05T12:00:00.000Z");
    expect(screen.getByText("2026-03-04 12:00:00 UTC")).toBeInTheDocument();
    expect(screen.getByText(/Expires/)).toBeInTheDocument();
  });

  it("offers decision controls only for a pending approval and only when a decision action is provided", () => {
    const { rerender } = render(<ApprovalCard approval={base} decide={decide} />);
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();

    rerender(<ApprovalCard approval={base} />);
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();

    rerender(<ApprovalCard approval={{ ...base, status: "approved" }} decide={decide} />);
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
  });

  it("explains who decided and why, and flags a self-approved decision", () => {
    render(
      <ApprovalCard
        approval={{ ...base, status: "approved", decidedByPrincipalId: "aaaaaaaa-1111-4111-8111-111111111111", decisionReason: "Looks right", selfApproved: true, decidedAt: "2026-03-04T13:00:00.000Z" }}
      />,
    );
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText(/Looks right/)).toBeInTheDocument();
    expect(screen.getByText(/the person who started the run was the only approver/i)).toBeInTheDocument();
    expect(screen.getByText("aaaaaaaa")).toHaveAttribute("title", "aaaaaaaa-1111-4111-8111-111111111111");
  });

  it("renders arguments as text, never markup, and truncates very long values", () => {
    render(
      <ApprovalCard
        approval={{ ...base, arguments: { title: "<img src=x onerror=alert(1)>", body: "x".repeat(2000) } }}
      />,
    );
    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText("<img src=x onerror=alert(1)>")).toBeInTheDocument();
    expect(screen.getByText(/^x+…$/).textContent!.length).toBeLessThan(500);
  });

  it("formats non-string argument values safely", () => {
    render(<ApprovalCard approval={{ ...base, arguments: { count: 3, flag: true, nested: { a: 1 }, none: null } }} />);
    const args = screen.getByTestId("approval-arguments");
    expect(within(args).getByText("3")).toBeInTheDocument();
    expect(within(args).getByText("true")).toBeInTheDocument();
    expect(within(args).getByText('{"a":1}')).toBeInTheDocument();
    expect(within(args).getByText("—")).toBeInTheDocument();
  });

  it("links to the run when a link target is provided", () => {
    render(<ApprovalCard approval={base} runHref="/runs/abc" />);
    expect(screen.getByRole("link", { name: "View run" })).toHaveAttribute("href", "/runs/abc");
  });
});
