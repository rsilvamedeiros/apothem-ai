import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActionState } from "@/lib/action-state";
import type { ToolOption } from "@/features/agents/tool-bindings";
import { ToolPolicyEditor } from "./components/tool-policy-editor";
import { SettingsView } from "./screens/settings-view";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;
const make = (state: ActionState = { ok: true }) => vi.fn<Action>(async () => state);

const tools: ToolOption[] = [
  { name: "get_current_time", description: "Returns the time.", risk: "read_only", allowedApprovalModes: ["required", "auto"] },
  { name: "create_note", description: "Saves a note.", risk: "reversible_write", allowedApprovalModes: ["required", "auto"] },
];

describe("ToolPolicyEditor", () => {
  it("lists every tool with its risk and a choice, starting from the rules in force", () => {
    render(<ToolPolicyEditor action={make()} tools={tools} rules={{ create_note: "blocked" }} />);
    expect(screen.getByLabelText("Create note")).toHaveValue("blocked");
    expect(screen.getByLabelText("Get current time")).toHaveValue("none");
    expect(screen.getByText("Read only")).toBeInTheDocument();
    expect(screen.getByText("Changes data (can be undone)")).toBeInTheDocument();
  });

  it("offers no rule, always ask first and blocked", () => {
    render(<ToolPolicyEditor action={make()} tools={tools} rules={{}} />);
    const options = Array.from(screen.getByLabelText("Create note").querySelectorAll("option")).map((option) => option.textContent);
    expect(options).toEqual(["No workspace rule", "Always ask a person first", "Blocked"]);
  });

  it("explains what a choice does as soon as it is made", async () => {
    render(<ToolPolicyEditor action={make()} tools={tools} rules={{}} />);
    expect(screen.queryByText(/not offered to the model/)).toBeNull();
    await userEvent.selectOptions(screen.getByLabelText("Create note"), "blocked");
    expect(screen.getByText(/No agent in this workspace can use this tool\. It is not offered to the model\./)).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Create note"), "approval_required");
    expect(screen.getByText(/Every use asks a person first, even when an agent is set to run this tool automatically\./)).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Create note"), "none");
    expect(screen.queryByText(/Every use asks/)).toBeNull();
  });

  it("submits the choice of every tool and never an id or a tenant", async () => {
    const action = make({ ok: true, message: "Tool policy saved. It applies to the next run." });
    render(<ToolPolicyEditor action={action} tools={tools} rules={{}} />);
    await userEvent.selectOptions(screen.getByLabelText("Create note"), "blocked");
    await userEvent.click(screen.getByRole("button", { name: "Save policy" }));

    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    const form = action.mock.calls[0]![1];
    expect(form.get("rule:create_note")).toBe("blocked");
    expect(form.get("rule:get_current_time")).toBe("none");
    expect(document.querySelector('[name="workspaceId"]')).toBeNull();
    expect(document.querySelector('[name="organizationId"]')).toBeNull();
    expect(await screen.findByRole("status")).toHaveTextContent("Tool policy saved. It applies to the next run.");
  });

  it("keeps the choices on screen after saving", async () => {
    render(<ToolPolicyEditor action={make({ ok: true, message: "Saved." })} tools={tools} rules={{}} />);
    await userEvent.selectOptions(screen.getByLabelText("Create note"), "approval_required");
    await userEvent.click(screen.getByRole("button", { name: "Save policy" }));
    await screen.findByRole("status");
    expect(screen.getByLabelText("Create note")).toHaveValue("approval_required");
  });

  it("announces a refusal and keeps the choices", async () => {
    render(<ToolPolicyEditor action={make({ ok: false, message: "Only owners and admins can change the tool policy." })} tools={tools} rules={{}} />);
    await userEvent.selectOptions(screen.getByLabelText("Get current time"), "blocked");
    await userEvent.click(screen.getByRole("button", { name: "Save policy" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Only owners and admins");
    expect(screen.getByLabelText("Get current time")).toHaveValue("blocked");
  });

  it("says when there are no tools", () => {
    render(<ToolPolicyEditor action={make()} tools={[]} rules={{}} />);
    expect(screen.getByText("No tools are available yet.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save policy" })).toBeNull();
  });

  it("ignores a rule for a tool the catalog does not have", () => {
    render(<ToolPolicyEditor action={make()} tools={tools} rules={{ drop_database: "blocked" }} />);
    expect(screen.queryByLabelText(/drop database/i)).toBeNull();
    expect(screen.getByLabelText("Create note")).toHaveValue("none");
  });
});

describe("SettingsView", () => {
  const save = make();

  it("shows the tool policy and says it is a ceiling that never turns a tool on", () => {
    render(<SettingsView tools={{ kind: "ok", tools }} policies={{ kind: "ok", rules: {} }} saveToolPolicies={save} />);
    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tool policy" })).toBeInTheDocument();
    expect(screen.getByText(/never turns a tool on/)).toBeInTheDocument();
    expect(screen.getByText(/Only owners and admins can change them/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save policy" })).toBeInTheDocument();
  });

  it.each([
    [{ kind: "error", message: "The tool catalog could not be loaded." } as const, { kind: "ok", rules: {} } as const, "The tool catalog could not be loaded."],
    [{ kind: "ok", tools } as const, { kind: "error", message: "You don't have access to this workspace's tool policy." } as const, "You don't have access to this workspace's tool policy."],
    [{ kind: "ok", tools } as const, { kind: "unreachable" } as const, "apothem-api is unreachable. Try again shortly."],
  ])("explains a failure instead of showing an editor (%#)", (toolsResult, policiesResult, text) => {
    render(<SettingsView tools={toolsResult} policies={policiesResult} saveToolPolicies={save} />);
    expect(screen.getByRole("alert")).toHaveTextContent(text);
    expect(screen.queryByRole("button", { name: "Save policy" })).toBeNull();
  });
});
