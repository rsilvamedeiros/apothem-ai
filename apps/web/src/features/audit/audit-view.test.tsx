import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuditView } from "./audit-view";
import type { AuditEventView, LoadAuditEventsResult } from "./load-audit-events";

const event = (overrides: Partial<AuditEventView> = {}): AuditEventView => ({
  id: "e1",
  workspaceId: null,
  actorPrincipalId: "aaaaaaaa-1111-4111-8111-111111111111",
  action: "agent.version_published",
  targetType: "agent_version",
  targetId: "bbbbbbbb-2222-4222-8222-222222222222",
  createdAt: "2026-03-04T05:06:07.000Z",
  ...overrides,
});

const ok = (events: AuditEventView[], nextCursor: string | null = null): LoadAuditEventsResult => ({
  kind: "ok",
  events,
  nextCursor,
});

describe("AuditView", () => {
  it("renders one row per event with action, target and a UTC timestamp", () => {
    render(<AuditView result={ok([event()])} basePath="/org/o/audit" />);
    const row = screen.getAllByRole("row")[1]!;
    expect(within(row).getByText("agent.version_published")).toBeInTheDocument();
    expect(within(row).getByText(/agent_version/)).toBeInTheDocument();
    expect(within(row).getByText("2026-03-04 05:06:07 UTC")).toBeInTheDocument();
  });

  it("shortens ids but keeps the full value available", () => {
    render(<AuditView result={ok([event()])} basePath="/org/o/audit" />);
    const actor = screen.getByText("aaaaaaaa");
    expect(actor).toHaveAttribute("title", "aaaaaaaa-1111-4111-8111-111111111111");
  });

  it("offers older events through the opaque cursor, URL-encoded", () => {
    render(<AuditView result={ok([event()], "a+b/c=")} basePath="/org/o/audit" />);
    expect(screen.getByRole("link", { name: "Older events" })).toHaveAttribute(
      "href",
      "/org/o/audit?cursor=a%2Bb%2Fc%3D",
    );
  });

  it("hides the older events link on the last page and links back to the latest on later pages", () => {
    render(<AuditView result={ok([event()])} basePath="/org/o/audit" isLaterPage />);
    expect(screen.queryByRole("link", { name: "Older events" })).toBeNull();
    expect(screen.getByRole("link", { name: "Latest events" })).toHaveAttribute("href", "/org/o/audit");
  });

  it("shows an empty state", () => {
    render(<AuditView result={ok([])} basePath="/org/o/audit" />);
    expect(screen.getByText("No audit events yet.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("renders event text as text, never markup", () => {
    render(<AuditView result={ok([event({ action: "<img src=x onerror=alert(1)>" })])} basePath="/org/o/audit" />);
    expect(document.querySelector("img")).toBeNull();
  });

  it.each([
    [{ kind: "error", message: "You do not have permission to view the audit log." } as const, "permission"],
    [{ kind: "unreachable" } as const, "unreachable"],
  ])("announces failures as an alert (%j)", (result, text) => {
    render(<AuditView result={result} basePath="/org/o/audit" />);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
  });
});
