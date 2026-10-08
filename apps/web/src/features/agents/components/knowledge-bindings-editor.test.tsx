import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActionState } from "@/lib/action-state";
import type { KnowledgeBaseView } from "@/features/knowledge/knowledge-model";
import { KnowledgeBindingsEditor } from "./knowledge-bindings-editor";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;
const make = (state: ActionState = { ok: true }) => vi.fn<Action>(async () => state);

const A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const GONE = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

const base = (id: string, name: string, status: "active" | "archived" = "active", description: string | null = null): KnowledgeBaseView => ({
  id,
  name,
  description,
  status,
  createdAt: "2026-03-04T12:00:00.000Z",
  archivedAt: null,
});

const bases = [base(A, "Handbook", "active", "Policies"), base(B, "Support", "active"), base(GONE, "Retired", "archived")];

function renderEditor(props: Partial<React.ComponentProps<typeof KnowledgeBindingsEditor>> = {}) {
  const action = (props.action as ReturnType<typeof make> | undefined) ?? make();
  render(
    <KnowledgeBindingsEditor action={action} bases={bases} bindings={[]} searchToolOn disabled={false} knowledgeHref="/knowledge" {...props} />,
  );
  return action;
}

describe("KnowledgeBindingsEditor", () => {
  it("lists only active bases, with their descriptions, none checked by default", () => {
    renderEditor();
    expect(screen.getByLabelText("Handbook")).not.toBeChecked();
    expect(screen.getByLabelText("Support")).not.toBeChecked();
    expect(screen.queryByLabelText("Retired")).toBeNull();
    expect(screen.getByText("Policies")).toBeInTheDocument();
  });

  it("starts from the saved bindings and ignores malformed ones", () => {
    renderEditor({ bindings: [{ knowledgeBaseId: B }, { knowledgeBaseId: "../x" }, null] });
    expect(screen.getByLabelText("Support")).toBeChecked();
    expect(screen.getByLabelText("Handbook")).not.toBeChecked();
  });

  it("submits exactly the checked bases", async () => {
    const action = renderEditor();
    await userEvent.click(screen.getByLabelText("Handbook"));
    await userEvent.click(screen.getByRole("button", { name: "Save knowledge" }));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get(`base:${A}`)).toBe("on");
    expect(form.get(`base:${B}`)).toBeNull();
  });

  it("keeps the choice on screen after saving", async () => {
    renderEditor({ action: make({ ok: true, message: "Knowledge saved." }) });
    await userEvent.click(screen.getByLabelText("Handbook"));
    await userEvent.click(screen.getByRole("button", { name: "Save knowledge" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Knowledge saved.");
    expect(screen.getByLabelText("Handbook")).toBeChecked();
  });

  it("announces a refusal and keeps the choice", async () => {
    renderEditor({ action: make({ ok: false, message: "You don't have permission to edit this agent." }) });
    await userEvent.click(screen.getByLabelText("Support"));
    await userEvent.click(screen.getByRole("button", { name: "Save knowledge" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("permission");
    expect(screen.getByLabelText("Support")).toBeChecked();
  });

  it("is read-only when disabled", () => {
    renderEditor({ disabled: true });
    expect(screen.getByLabelText("Handbook")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save knowledge" })).toBeDisabled();
  });

  describe("coherence with the search tool", () => {
    it("warns when bases are attached but the tool is off", () => {
      renderEditor({ bindings: [{ knowledgeBaseId: A }], searchToolOn: false });
      expect(screen.getByText(/only search these once the “Search knowledge” tool is turned on/)).toBeInTheDocument();
    });

    it("warns when the tool is on but nothing is attached", () => {
      renderEditor({ bindings: [], searchToolOn: true });
      expect(screen.getByText(/no knowledge base is attached, so it will find nothing/)).toBeInTheDocument();
    });

    it("reacts to the checkboxes before saving", async () => {
      renderEditor({ bindings: [], searchToolOn: false });
      expect(screen.queryByText(/only search these/)).toBeNull();
      await userEvent.click(screen.getByLabelText("Handbook"));
      expect(screen.getByText(/only search these/)).toBeInTheDocument();
    });

    it("is quiet when both are set", () => {
      renderEditor({ bindings: [{ knowledgeBaseId: A }], searchToolOn: true });
      expect(screen.queryByText(/only search these/)).toBeNull();
      expect(screen.queryByText(/will find nothing/)).toBeNull();
    });
  });

  describe("saved bases that no longer work", () => {
    it("says that an archived or missing base returns nothing and is dropped on save", () => {
      renderEditor({ bindings: [{ knowledgeBaseId: GONE }, { knowledgeBaseId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd" }] });
      expect(screen.getByText(/2 attached knowledge bases are archived or no longer exist\. They return nothing and are dropped when you save\./)).toBeInTheDocument();
    });

    it("uses the singular for one", () => {
      renderEditor({ bindings: [{ knowledgeBaseId: GONE }] });
      expect(screen.getByText(/1 attached knowledge base is archived or no longer exist\. It returns nothing and is dropped when you save\./)).toBeInTheDocument();
    });
  });

  it("limits the choice to five bases", async () => {
    const many = Array.from({ length: 6 }, (_, n) => base(`00000000-0000-4000-8000-00000000000${n}`, `Base ${n}`));
    renderEditor({ bases: many, searchToolOn: true });
    for (const b of many) await userEvent.click(screen.getByLabelText(b.name));
    expect(screen.getByRole("alert")).toHaveTextContent("An agent can use at most 5 knowledge bases.");
  });

  it("points to the knowledge page when there is nothing to attach", () => {
    renderEditor({ bases: [base(GONE, "Retired", "archived")] });
    expect(screen.getByRole("link", { name: "Create one" })).toHaveAttribute("href", "/knowledge");
    expect(screen.queryByRole("button", { name: "Save knowledge" })).toBeNull();
  });

  it("renders names as text, never markup", () => {
    renderEditor({ bases: [base(A, "<script>alert(1)</script>", "active", "<img src=x onerror=alert(1)>")] });
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("img")).toBeNull();
  });
});
