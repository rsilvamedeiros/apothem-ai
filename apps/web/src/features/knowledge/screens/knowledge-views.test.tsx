import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LoadKnowledgeBaseResult, LoadKnowledgeBasesResult } from "../load-knowledge";
import type { KnowledgeBaseView, KnowledgeDocumentView } from "../knowledge-model";
import { KnowledgeBaseView as BaseView } from "./knowledge-base-view";
import { KnowledgeView } from "./knowledge-view";

const action = vi.fn(async () => ({ ok: true }));
const search = vi.fn(async () => ({}));

const base = (overrides: Partial<KnowledgeBaseView> = {}): KnowledgeBaseView => ({
  id: "kb1",
  name: "Handbook",
  description: "Policies",
  status: "active",
  createdAt: "2026-03-04T12:00:00.000Z",
  archivedAt: null,
  ...overrides,
});

const documentView = (overrides: Partial<KnowledgeDocumentView> = {}): KnowledgeDocumentView => ({
  id: "d1",
  knowledgeBaseId: "kb1",
  title: "Refund policy",
  checksum: "abcdef0123456789",
  contentLength: 1234,
  chunkCount: 3,
  createdAt: "2026-03-05T12:00:00.000Z",
  ...overrides,
});

describe("KnowledgeView", () => {
  const view = (result: LoadKnowledgeBasesResult) => render(<KnowledgeView result={result} basePath="/k" createBase={action} />);

  it("lists bases with a link, a description, a date and a status", () => {
    view({ kind: "ok", bases: [base(), base({ id: "kb2", name: "Old", description: null, status: "archived" })] });
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByRole("link", { name: "Handbook" })).toHaveAttribute("href", "/k/kb1");
    expect(items[0]).toHaveTextContent("Policies");
    expect(items[0]).toHaveTextContent("Created 2026-03-04");
    expect(items[0]).toHaveTextContent("Active");
    expect(items[1]).toHaveTextContent("Archived");
  });

  it("says when there is nothing yet, and still offers to create one", () => {
    view({ kind: "ok", bases: [] });
    expect(screen.getByText("No knowledge bases yet in this workspace.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create knowledge base" })).toBeInTheDocument();
    expect(screen.getByText(/Files, web pages and connectors are not supported yet/)).toBeInTheDocument();
  });

  it.each([
    [{ kind: "error", message: "You don't have access to knowledge in this workspace." } as const, "You don't have access to knowledge in this workspace."],
    [{ kind: "unreachable" } as const, "apothem-api is unreachable. Try again shortly."],
  ])("renders a non-ok result (%j)", (result, text) => {
    view(result);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
  });

  it("renders base text as text, never markup", () => {
    view({ kind: "ok", bases: [base({ name: "<script>alert(1)</script>" })] });
    expect(document.querySelector("script")).toBeNull();
  });
});

describe("KnowledgeBaseView", () => {
  const removeFor = vi.fn<(id: string) => typeof action>(() => action);
  beforeEach(() => removeFor.mockClear());
  const view = (result: LoadKnowledgeBaseResult) =>
    render(<BaseView result={result} backHref="/k" addDocument={action} removeDocument={removeFor} archive={action} search={search} />);

  it("shows the base, its documents with size, passages, date and checksum, and every tool", () => {
    view({ kind: "ok", base: base(), documents: [documentView(), documentView({ id: "d2", title: "Shipping", chunkCount: 1, contentLength: 1 })] });
    expect(screen.getByRole("heading", { level: 1, name: "Handbook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Knowledge/ })).toHaveAttribute("href", "/k");
    const items = within(screen.getByRole("heading", { name: "Documents" }).closest("section")!).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Refund policy");
    expect(items[0]).toHaveTextContent("1,234 characters · 3 passages · added 2026-03-05");
    expect(items[0]).toHaveTextContent("abcdef01");
    expect(items[1]).toHaveTextContent("1 character · 1 passage");
    expect(screen.getByRole("button", { name: "Add document" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
  });

  it("builds the remove action for each document on the server side", () => {
    view({ kind: "ok", base: base(), documents: [documentView(), documentView({ id: "d2", title: "Shipping" })] });
    expect(removeFor.mock.calls.map((call) => call[0])).toEqual(["d1", "d2"]);
    expect(screen.getByRole("button", { name: "Remove Refund policy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Shipping" })).toBeInTheDocument();
  });

  it("explains an empty base", () => {
    view({ kind: "ok", base: base(), documents: [] });
    expect(screen.getByText(/No documents yet/)).toBeInTheDocument();
  });

  it("makes an archived base read-only", () => {
    view({ kind: "ok", base: base({ status: "archived" }), documents: [documentView()] });
    expect(screen.getByText("Archived")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add document" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Search" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Archive" })).toBeNull();
    expect(screen.getByText(/archived, so documents can no longer be added/)).toBeInTheDocument();
  });

  it("renders document text as text, never markup", () => {
    view({ kind: "ok", base: base({ name: "<script>alert(1)</script>" }), documents: [documentView({ title: "<img src=x onerror=alert(1)>" })] });
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("img")).toBeNull();
  });

  it.each([
    [{ kind: "not_found" } as const, "Knowledge base not found."],
    [{ kind: "error", message: "You don't have access to knowledge in this workspace." } as const, "You don't have access to knowledge in this workspace."],
    [{ kind: "unreachable" } as const, "apothem-api is unreachable. Try again shortly."],
  ])("renders a non-ok result (%j)", (result, text) => {
    view(result);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
    expect(screen.getByRole("link", { name: /Knowledge/ })).toHaveAttribute("href", "/k");
  });
});
