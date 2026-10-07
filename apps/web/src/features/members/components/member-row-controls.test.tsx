import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActionState } from "@/lib/action-state";
import { MemberRowControls } from "./member-row-controls";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;
const make = (result: ActionState = { ok: true, message: "Done." }) => vi.fn<Action>(async () => result);

function setup(status: "active" | "invited" | "revoked" = "active", role = "operator") {
  const changeRole = make({ ok: true, message: "Role updated." });
  const revoke = make({ ok: true, message: "Access revoked." });
  render(<MemberRowControls email="a@example.com" role={role as never} status={status} changeRole={changeRole} revoke={revoke} />);
  return { changeRole, revoke };
}

describe("MemberRowControls", () => {
  it("preselects the current role and labels controls with the member email", () => {
    setup("active", "builder");
    expect(screen.getByLabelText("Role for a@example.com")).toHaveValue("builder");
  });

  it("submits the new role", async () => {
    const { changeRole } = setup();
    await userEvent.selectOptions(screen.getByLabelText("Role for a@example.com"), "auditor");
    await userEvent.click(screen.getByRole("button", { name: "Update role" }));
    expect(changeRole).toHaveBeenCalledOnce();
    expect(changeRole.mock.calls[0]![1].get("role")).toBe("auditor");
    expect(await screen.findByRole("status")).toHaveTextContent("Role updated.");
  });

  it("does not offer an update when the role has not changed", () => {
    setup("active", "operator");
    expect(screen.getByRole("button", { name: "Update role" })).toBeDisabled();
  });

  it("asks for confirmation before revoking and can cancel", async () => {
    const { revoke } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Revoke access" }));
    expect(revoke).not.toHaveBeenCalled();
    expect(screen.getByText(/lose access immediately/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText(/lose access immediately/i)).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Revoke access" }));
    await userEvent.click(screen.getByRole("button", { name: "Confirm revoke" }));
    expect(revoke).toHaveBeenCalledOnce();
    expect(await screen.findByRole("status")).toHaveTextContent("Access revoked.");
  });

  it("shows API refusals as alerts", async () => {
    const changeRole = make({ ok: false, message: "Your role cannot make this change." });
    render(<MemberRowControls email="a@example.com" role="operator" status="active" changeRole={changeRole} revoke={make()} />);
    await userEvent.selectOptions(screen.getByLabelText("Role for a@example.com"), "owner");
    await userEvent.click(screen.getByRole("button", { name: "Update role" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("cannot make this change");
  });

  it("offers no controls for a revoked member", () => {
    setup("revoked");
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();
  });
});
