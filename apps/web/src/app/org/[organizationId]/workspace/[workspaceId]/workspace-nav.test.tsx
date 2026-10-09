import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceNav } from "./workspace-nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/org/o/workspace/w/overview" }));

const BASE = "/org/o/workspace/w";

describe("WorkspaceNav", () => {
  it("links every section and marks the current one", () => {
    render(<WorkspaceNav basePath={BASE} />);
    expect(screen.getByRole("link", { name: "Approvals" })).toHaveAttribute("href", `${BASE}/approvals`);
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", `${BASE}/settings`);
    expect(screen.getByRole("link", { name: "Overview" }).className).toMatch(/navItemActive/);
    expect(screen.getByRole("link", { name: "Agents" }).className).not.toMatch(/navItemActive/);
  });

  it("shows no badge when nothing waits, or when the count is not given", () => {
    const { rerender } = render(<WorkspaceNav basePath={BASE} />);
    expect(screen.queryByText(/waiting for a person/)).toBeNull();
    rerender(<WorkspaceNav basePath={BASE} pendingApprovals={0} />);
    expect(screen.queryByText(/waiting for a person/)).toBeNull();
    expect(screen.getByRole("link", { name: "Approvals" })).toBeInTheDocument();
  });

  it("badges only the approvals link, with the count and a spoken form", () => {
    render(<WorkspaceNav basePath={BASE} pendingApprovals={3} />);
    const approvals = screen.getByRole("link", { name: /Approvals/ });
    expect(approvals).toHaveTextContent("3");
    expect(approvals).toHaveAccessibleName(/^Approvals\s*3 approvals waiting for a person$/);
    expect(screen.getByRole("link", { name: "Agents" })).not.toHaveTextContent("3");
    expect(screen.getAllByText(/waiting for a person/)).toHaveLength(1);
  });

  it("uses the singular for one, and caps a long queue", () => {
    const { rerender } = render(<WorkspaceNav basePath={BASE} pendingApprovals={1} />);
    expect(screen.getByText("1 approval waiting for a person")).toBeInTheDocument();
    rerender(<WorkspaceNav basePath={BASE} pendingApprovals={250} />);
    expect(screen.getByRole("link", { name: /Approvals/ })).toHaveTextContent("99+");
  });
});
