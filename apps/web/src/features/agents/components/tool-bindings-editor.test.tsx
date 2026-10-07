import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActionState } from "@/lib/action-state";
import type { ToolOption } from "../tool-bindings";
import { ToolBindingsEditor } from "./tool-bindings-editor";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;
const make = (state: ActionState = { ok: true, message: "Tools saved." }) => vi.fn<Action>(async () => state);

const TOOLS: ToolOption[] = [
  { name: "get_current_time", description: "Returns the current time.", risk: "read_only", allowedApprovalModes: ["required", "auto"] },
  { name: "create_note", description: "Saves a note.", risk: "reversible_write", allowedApprovalModes: ["required", "auto"] },
  { name: "wire_money", description: "Sends money.", risk: "irreversible", allowedApprovalModes: ["required"] },
];

describe("ToolBindingsEditor", () => {
  it("lists every catalog tool with its description and risk, all off by default", () => {
    render(<ToolBindingsEditor action={make()} tools={TOOLS} bindings={[]} disabled={false} />);
    expect(screen.getByText("Get current time")).toBeInTheDocument();
    expect(screen.getByText("Saves a note.")).toBeInTheDocument();
    expect(screen.getByText("Irreversible")).toBeInTheDocument();
    for (const tool of TOOLS) {
      expect(screen.getByLabelText(new RegExp(`${tool.name.replace(/_/g, " ")}`, "i"))).toHaveValue("off");
    }
  });

  it("starts from the saved bindings", () => {
    render(
      <ToolBindingsEditor
        action={make()}
        tools={TOOLS}
        bindings={[{ tool: "create_note", approval: "required" }, { tool: "get_current_time", approval: "auto" }]}
        disabled={false}
      />,
    );
    expect(screen.getByLabelText(/create note/i)).toHaveValue("required");
    expect(screen.getByLabelText(/get current time/i)).toHaveValue("auto");
  });

  it("makes asking a person the recommended choice and never offers automatic for irreversible tools", () => {
    render(<ToolBindingsEditor action={make()} tools={TOOLS} bindings={[]} disabled={false} />);
    const note = screen.getByLabelText(/create note/i);
    expect(within(note).getByRole("option", { name: "Ask a person first (recommended)" })).toBeInTheDocument();
    expect(within(note).getByRole("option", { name: "Run automatically" })).toBeInTheDocument();

    const money = screen.getByLabelText(/wire money/i);
    expect(within(money).queryByRole("option", { name: "Run automatically" })).toBeNull();
  });

  it("submits one field per tool with the chosen mode", async () => {
    const action = make();
    render(<ToolBindingsEditor action={action} tools={TOOLS} bindings={[]} disabled={false} />);
    await userEvent.selectOptions(screen.getByLabelText(/create note/i), "required");
    await userEvent.selectOptions(screen.getByLabelText(/get current time/i), "auto");
    await userEvent.click(screen.getByRole("button", { name: "Save tools" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get("tool:create_note")).toBe("required");
    expect(form.get("tool:get_current_time")).toBe("auto");
    expect(form.get("tool:wire_money")).toBe("off");
    expect(await screen.findByRole("status")).toHaveTextContent("Tools saved.");
  });

  it("warns that automatic writes skip the human check", async () => {
    render(<ToolBindingsEditor action={make()} tools={TOOLS} bindings={[]} disabled={false} />);
    expect(screen.queryByText(/without asking a person/i)).toBeNull();
    await userEvent.selectOptions(screen.getByLabelText(/create note/i), "auto");
    expect(screen.getByText(/without asking a person/i)).toBeInTheDocument();
  });

  it("shows API refusals as alerts and keeps the selection", async () => {
    render(<ToolBindingsEditor action={make({ ok: false, message: "You don't have permission to edit this agent." })} tools={TOOLS} bindings={[]} disabled={false} />);
    await userEvent.selectOptions(screen.getByLabelText(/create note/i), "required");
    await userEvent.click(screen.getByRole("button", { name: "Save tools" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("permission");
    expect(screen.getByLabelText(/create note/i)).toHaveValue("required");
  });

  it("is read-only when editing is disabled", () => {
    render(<ToolBindingsEditor action={make()} tools={TOOLS} bindings={[]} disabled />);
    expect(screen.getByLabelText(/create note/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save tools" })).toBeDisabled();
  });

  it("says so when the catalog is empty", () => {
    render(<ToolBindingsEditor action={make()} tools={[]} bindings={[]} disabled={false} />);
    expect(screen.getByText("No tools are available yet.")).toBeInTheDocument();
  });
});
