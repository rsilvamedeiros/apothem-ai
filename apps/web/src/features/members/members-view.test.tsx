import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MembersView } from "./members-view";
import type { LoadMembersResult, MemberRow } from "./load-members";

const action = vi.fn(async () => ({ ok: true }));
const actions = { add: action, changeRole: () => action, revoke: () => action };

const row = (overrides: Partial<MemberRow> = {}): MemberRow => ({
  membershipId: "m1",
  principalId: "p1",
  email: "owner@example.com",
  name: "Olivia Owner",
  role: "owner",
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const ok = (members: MemberRow[]): LoadMembersResult => ({ kind: "ok", members });

describe("MembersView", () => {
  it("lists members with name, email, role and status", () => {
    render(<MembersView result={ok([row()])} {...actions} />);
    const rows = screen.getAllByRole("row");
    expect(within(rows[1]!).getByText("Olivia Owner")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("owner@example.com")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("Active")).toBeInTheDocument();
  });

  it("shows revoked members as history without controls", () => {
    render(
      <MembersView
        result={ok([row(), row({ membershipId: "m2", email: "gone@example.com", status: "revoked", role: "builder" })])}
        {...actions}
      />,
    );
    const revoked = screen.getByText("gone@example.com").closest("tr")!;
    expect(within(revoked).getByText("Revoked")).toBeInTheDocument();
    expect(within(revoked).queryByRole("button")).toBeNull();
  });

  it("renders the add member form", () => {
    render(<MembersView result={ok([row()])} {...actions} />);
    expect(screen.getByRole("button", { name: "Add member" })).toBeInTheDocument();
  });

  it("renders member text as text, never markup", () => {
    render(<MembersView result={ok([row({ name: "<img src=x onerror=alert(1)>" })])} {...actions} />);
    expect(document.querySelector("img")).toBeNull();
  });

  it.each([
    [{ kind: "error", message: "You do not have permission to view members." } as const, "permission"],
    [{ kind: "unreachable" } as const, "unreachable"],
  ])("announces failures as an alert and hides the add form (%j)", (result, text) => {
    render(<MembersView result={result} {...actions} />);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
    expect(screen.queryByRole("button", { name: "Add member" })).toBeNull();
  });
});
