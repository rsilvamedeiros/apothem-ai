import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { EvidenceView } from "../knowledge-model";
import { SearchPanel, type SearchPanelState } from "./search-panel";

type Action = (prev: SearchPanelState, form: FormData) => Promise<SearchPanelState>;
const make = (state: SearchPanelState) => vi.fn<Action>(async () => state);

const evidence = (overrides: Partial<EvidenceView> = {}): EvidenceView => ({
  evidenceId: crypto.randomUUID(),
  knowledgeBaseId: "kb",
  documentId: "doc",
  title: "Refund policy",
  section: "Refunds",
  ordinal: 2,
  text: "Refunds take five days.",
  score: 0.3,
  ...overrides,
});

async function search(state: SearchPanelState) {
  const action = make(state);
  render(<SearchPanel action={action} disabled={false} />);
  await userEvent.type(screen.getByLabelText("Question or keywords"), "how long do refunds take");
  await userEvent.click(screen.getByRole("button", { name: "Search" }));
  await waitFor(() => expect(action).toHaveBeenCalledOnce());
  return action;
}

describe("SearchPanel", () => {
  it("limits the query and submits what was typed", async () => {
    const action = await search({ results: [] });
    expect(action.mock.calls[0]![1].get("query")).toBe("how long do refunds take");
    expect(screen.getByLabelText("Question or keywords")).toHaveAttribute("maxlength", "500");
  });

  it("shows each passage with where it came from", async () => {
    await search({ results: [evidence(), evidence({ title: "Shipping", section: null, ordinal: 0, text: "Ships in two days." })] });
    const list = await screen.findByRole("list", { name: "Matching passages" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Refund policy · Refunds, passage 3");
    expect(items[0]).toHaveTextContent("Refunds take five days.");
    expect(items[1]).toHaveTextContent("Shipping · passage 1");
  });

  it("renders passage text as text, never as markup", async () => {
    await search({ results: [evidence({ text: "<script>alert(1)</script><b>bold</b>" })] });
    const list = await screen.findByRole("list", { name: "Matching passages" });
    expect(list).toHaveTextContent("<script>alert(1)</script><b>bold</b>");
    expect(document.querySelector("script")).toBeNull();
    expect(list.querySelector("b")).toBeNull();
  });

  it("says plainly when nothing matched", async () => {
    await search({ results: [] });
    expect(await screen.findByRole("status")).toHaveTextContent("No passage matched. An agent would receive nothing for this query.");
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("announces a refusal", async () => {
    await search({ message: "This knowledge base is archived, so it cannot be searched." });
    expect(await screen.findByRole("alert")).toHaveTextContent("archived");
  });

  it("offers no search for an archived base", () => {
    render(<SearchPanel action={make({})} disabled />);
    expect(screen.queryByRole("button", { name: "Search" })).toBeNull();
    expect(screen.getByText("An archived knowledge base cannot be searched.")).toBeInTheDocument();
  });
});
